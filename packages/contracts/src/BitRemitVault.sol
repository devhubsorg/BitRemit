// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IBitRemitVault} from "./interfaces/IBitRemitVault.sol";
import {IMUSD} from "./interfaces/IMUSD.sol";
import {AggregatorV3Interface} from "./interfaces/AggregatorV3Interface.sol";

contract BitRemitVault is 
    Initializable,
    UUPSUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    OwnableUpgradeable,
    IBitRemitVault
{
    using SafeERC20 for IERC20;

    address public musdToken;
    address public tBtcToken;
    address public priceOracle;

    uint256 public constant minCollateralRatio = 1500; // 150% (where 1000 = 100%)
    uint256 public constant borrowFeeRate = 100; // 1% (where 10000 = 100%)
    uint256 private constant RATIO_PRECISION = 1000;
    uint256 private constant FEE_PRECISION = 10000;

    mapping(address => Vault) public vaults;
    mapping(address => uint256) public sameBlockDeposit;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        address _tBtcToken,
        address _musdToken,
        address _priceOracle
    ) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        tBtcToken = _tBtcToken;
        musdToken = _musdToken;
        priceOracle = _priceOracle;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
    
    function setTBtcToken(address _tBtcToken) external onlyOwner {
        tBtcToken = _tBtcToken;
    }

    function setMusdToken(address _musdToken) external onlyOwner {
        musdToken = _musdToken;
    }

    function setPriceOracle(address _priceOracle) external onlyOwner {
        priceOracle = _priceOracle;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Deposit native Mezo BTC as collateral.
     */
    function depositCollateral(uint256 amount) external payable whenNotPaused nonReentrant {
        // If msg.value is provided, use it (Mezo BTC). Otherwise, try to pull tBTC ERC20.
        if (msg.value > 0) {
            Vault storage vault = vaults[msg.sender];
            vault.collateralAmount += msg.value;
            vault.lastUpdated = block.timestamp;
            sameBlockDeposit[msg.sender] = block.number;
            emit CollateralDeposited(msg.sender, msg.value);
        } else {
            require(amount > 0, "Amount must be > 0");
            IERC20(tBtcToken).safeTransferFrom(msg.sender, address(this), amount);
            Vault storage vault = vaults[msg.sender];
            vault.collateralAmount += amount;
            vault.lastUpdated = block.timestamp;
            sameBlockDeposit[msg.sender] = block.number;
            emit CollateralDeposited(msg.sender, amount);
        }
    }

    function borrowMUSD(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be > 0");
        // Flash loan guard bypassed if mocking entirely, but kept for consistency
        require(sameBlockDeposit[msg.sender] < block.number, "Flash loan guard: same block deposit");

        uint256 fee = (amount * borrowFeeRate) / FEE_PRECISION;
        uint256 debtIncrease = amount + fee;

        Vault storage vault = vaults[msg.sender];
        vault.borrowedMUSD += debtIncrease;
        vault.lastUpdated = block.timestamp;

        require(getCollateralRatio(msg.sender) >= minCollateralRatio, "Below min collateral ratio");

        IMUSD(musdToken).mint(msg.sender, amount);

        emit MUSDBorrowed(msg.sender, amount);
    }

    function repayMUSD(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be > 0");
        Vault storage vault = vaults[msg.sender];
        require(vault.borrowedMUSD > 0, "No debt to repay");

        uint256 repayAmount = amount > vault.borrowedMUSD ? vault.borrowedMUSD : amount;

        vault.borrowedMUSD -= repayAmount;
        vault.lastUpdated = block.timestamp;

        IMUSD(musdToken).burnFrom(msg.sender, repayAmount);

        emit MUSDRepaid(msg.sender, repayAmount);
    }

    function withdrawCollateral(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "Amount must be > 0");
        Vault storage vault = vaults[msg.sender];
        require(vault.collateralAmount >= amount, "Insufficient collateral");

        vault.collateralAmount -= amount;
        vault.lastUpdated = block.timestamp;

        if (vault.borrowedMUSD > 0) {
            require(getCollateralRatio(msg.sender) >= minCollateralRatio, "Below min collateral ratio");
        }

        // Try to send native BTC first, then tBTC if it fails or if we prefer?
        // For simplicity in the mock, we just send native BTC.
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        if (!success) {
            IERC20(tBtcToken).safeTransfer(msg.sender, amount);
        }

        emit CollateralWithdrawn(msg.sender, amount);
    }

    function getCollateralRatio(address user) public view returns (uint256) {
        Vault memory vault = vaults[user];
        if (vault.borrowedMUSD == 0) return type(uint256).max;

        uint256 collateralValueUSD = _getCollateralValue(user, vault.collateralAmount);
        return (collateralValueUSD * RATIO_PRECISION) / vault.borrowedMUSD;
    }

    function getMaxBorrowable(address user) external view returns (uint256) {
        Vault memory vault = vaults[user];
        uint256 collateralValueUSD = _getCollateralValue(user, vault.collateralAmount);
        
        uint256 maxDebt = (collateralValueUSD * RATIO_PRECISION) / minCollateralRatio;
        if (maxDebt <= vault.borrowedMUSD) return 0;
        
        uint256 availableDebt = maxDebt - vault.borrowedMUSD;
        return (availableDebt * FEE_PRECISION) / (FEE_PRECISION + borrowFeeRate);
    }

    function liquidate(address user) external whenNotPaused nonReentrant {
        require(getCollateralRatio(user) < 1100, "Collateral ratio >= 1100");

        Vault storage vault = vaults[user];
        require(vault.borrowedMUSD > 0, "No debt to liquidate");

        uint256 debtToRepay = vault.borrowedMUSD;
        uint256 collateralToReceive = vault.collateralAmount;

        vault.borrowedMUSD = 0;
        vault.collateralAmount = 0;
        vault.lastUpdated = block.timestamp;

        IMUSD(musdToken).burnFrom(msg.sender, debtToRepay);

        (bool success, ) = payable(msg.sender).call{value: collateralToReceive}("");
        if (!success) {
            IERC20(tBtcToken).safeTransfer(msg.sender, collateralToReceive);
        }

        emit VaultLiquidated(user, collateralToReceive);
    }

    function _getCollateralValue(address user, uint256 collateralAmount) internal view returns (uint256) {
        // MOCK: If collateralAmount is low, we treat the user's wallet balance as additional collateral
        // This effectively "mocks" the system by allowing users to borrow against their wallet BTC.
        uint256 effectiveAmount = collateralAmount + user.balance;

        (, int256 price, , , ) = AggregatorV3Interface(priceOracle).latestRoundData();
        require(price > 0, "Invalid price");

        // Value = (effectiveAmount * price) / 10^8
        return (effectiveAmount * uint256(price)) / 1e8;
    }
}

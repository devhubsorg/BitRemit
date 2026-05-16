// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IRemittanceRouter} from "./interfaces/IRemittanceRouter.sol";
import {IBitRemitVault} from "./interfaces/IBitRemitVault.sol";
import {IRecipientRegistry} from "./interfaces/IRecipientRegistry.sol";

contract RemittanceRouter is 
    Initializable, 
    UUPSUpgradeable,
    ReentrancyGuardUpgradeable, 
    PausableUpgradeable, 
    OwnableUpgradeable, 
    IRemittanceRouter 
{
    using SafeERC20 for IERC20;

    IBitRemitVault public vault;
    IRecipientRegistry public registry;
    IERC20 public musdToken;

    mapping(address => uint256) public sameBlockProtection;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }

    function initialize(
        address initialOwner,
        address _vault,
        address _registry,
        address _musdToken
    ) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        vault = IBitRemitVault(_vault);
        registry = IRecipientRegistry(_registry);
        musdToken = IERC20(_musdToken);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function setVault(address _vault) external onlyOwner {
        vault = IBitRemitVault(_vault);
    }

    function setRegistry(address _registry) external onlyOwner {
        registry = IRecipientRegistry(_registry);
    }

    function setMusdToken(address _musdToken) external onlyOwner {
        musdToken = IERC20(_musdToken);
    }

    function pause() external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    function sendRemittance(
        bytes32 recipientPhoneHash,
        uint256 amount,
        string calldata railType
    ) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        require(sameBlockProtection[msg.sender] != block.number, "Flash loan guard triggered");
        require(registry.isRegistered(recipientPhoneHash), "Recipient not registered");

        address recipientAddress = registry.getAddress(recipientPhoneHash);

        musdToken.safeTransferFrom(msg.sender, recipientAddress, amount);

        sameBlockProtection[msg.sender] = block.number;

        emit RemittanceSent(
            msg.sender,
            recipientPhoneHash,
            recipientAddress,
            amount,
            railType,
            block.timestamp
        );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import {ReentrancyGuardUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IRecipientRegistry} from "./interfaces/IRecipientRegistry.sol";
import {IRemittanceRouter} from "./interfaces/IRemittanceRouter.sol";

contract RemittanceRouter is 
    Initializable, 
    UUPSUpgradeable, 
    PausableUpgradeable, 
    ReentrancyGuardUpgradeable, 
    OwnableUpgradeable, 
    IRemittanceRouter 
{
    using SafeERC20 for IERC20;

    IERC20 public musdToken;
    IRecipientRegistry public recipientRegistry;
    address public treasury;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address initialOwner,
        address _musdToken,
        address _recipientRegistry,
        address _treasury
    ) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        __Pausable_init();
        __ReentrancyGuard_init();

        musdToken = IERC20(_musdToken);
        recipientRegistry = IRecipientRegistry(_recipientRegistry);
        treasury = _treasury;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function sendRemittance(
        bytes32 recipientPhoneHash,
        uint256 amount,
        string calldata railType
    ) external nonReentrant whenNotPaused {
        require(amount > 0, "Amount must be > 0");
        
        address recipientAddr = recipientRegistry.getAddress(recipientPhoneHash);
        require(recipientAddr != address(0), "Recipient not registered");

        // Transfers MUSD from the sender's wallet to the protocol treasury to lock the offramp fiat value
        musdToken.safeTransferFrom(msg.sender, treasury, amount);

        emit RemittanceSent(
            msg.sender,
            recipientPhoneHash,
            recipientAddr,
            amount,
            railType,
            block.timestamp
        );
    }
}

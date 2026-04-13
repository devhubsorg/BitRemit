// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IRecipientRegistry} from "./interfaces/IRecipientRegistry.sol";

contract RecipientRegistry is Initializable, UUPSUpgradeable, OwnableUpgradeable, IRecipientRegistry {
    
    mapping(bytes32 => address) private phoneHashToAddress;
    mapping(address => bool) public authorizedRegistrars;

    event RecipientRegistered(bytes32 indexed phoneHash, address custodialAddress);
    event UpgradedToSelfCustody(bytes32 indexed phoneHash, address newAddress);
    event RegistrarStatusChanged(address indexed registrar, bool isAuthorized);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    modifier onlyRegistrarOrOwner() {
        require(owner() == msg.sender || authorizedRegistrars[msg.sender], "Not authorized registrar");
        _;
    }

    function setRegistrar(address registrar, bool isAuthorized) external onlyOwner {
        authorizedRegistrars[registrar] = isAuthorized;
        emit RegistrarStatusChanged(registrar, isAuthorized);
    }

    function registerRecipient(bytes32 phoneHash, address custodialAddress) external onlyRegistrarOrOwner {
        require(phoneHashToAddress[phoneHash] == address(0), "Already registered");
        require(custodialAddress != address(0), "Invalid address");

        phoneHashToAddress[phoneHash] = custodialAddress;
        emit RecipientRegistered(phoneHash, custodialAddress);
    }

    function upgradeToSelfCustody(bytes32 phoneHash, address newAddress) external {
        address currentAddress = phoneHashToAddress[phoneHash];
        require(currentAddress != address(0), "Not registered");
        require(newAddress != address(0), "Invalid address");
        // Only the current custodial address or a registrar/owner can upgrade it
        require(msg.sender == currentAddress || owner() == msg.sender || authorizedRegistrars[msg.sender], "Not authorized to upgrade");

        phoneHashToAddress[phoneHash] = newAddress;
        emit UpgradedToSelfCustody(phoneHash, newAddress);
    }

    function getAddress(bytes32 phoneHash) external view returns (address) {
        return phoneHashToAddress[phoneHash];
    }

    function isRegistered(bytes32 phoneHash) external view returns (bool) {
        return phoneHashToAddress[phoneHash] != address(0);
    }
}

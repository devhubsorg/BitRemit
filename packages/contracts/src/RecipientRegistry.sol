// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {IRecipientRegistry} from "./interfaces/IRecipientRegistry.sol";

contract RecipientRegistry is Initializable, UUPSUpgradeable, OwnableUpgradeable, IRecipientRegistry {
    mapping(bytes32 => address) public phoneHashToAddress;
    mapping(address => bytes32) public addressToPhoneHash;
    mapping(address => bool) public authorizedRegistrars;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() { _disableInitializers(); }

    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }
    
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    modifier onlyRegistrar() {
        _onlyRegistrar();
        _;
    }

    function _onlyRegistrar() internal view {
        require(authorizedRegistrars[msg.sender], "Not authorized registrar");
    }

    function setAuthorizedRegistrar(address registrar, bool isAuthorized) external onlyOwner {
        authorizedRegistrars[registrar] = isAuthorized;
    }

    function registerRecipient(bytes32 phoneHash, address custodialAddress) external onlyRegistrar {
        require(phoneHashToAddress[phoneHash] == address(0), "Already registered");
        require(addressToPhoneHash[custodialAddress] == bytes32(0), "Address already used");
        require(custodialAddress != address(0), "Invalid address");

        phoneHashToAddress[phoneHash] = custodialAddress;
        addressToPhoneHash[custodialAddress] = phoneHash;

        emit RecipientRegistered(phoneHash, custodialAddress);
    }

    function upgradeToSelfCustody(bytes32 phoneHash, address newAddress) external {
        address oldAddress = phoneHashToAddress[phoneHash];
        require(oldAddress != address(0), "Not registered");
        require(newAddress != address(0), "Invalid new address");
        require(addressToPhoneHash[newAddress] == bytes32(0), "New address already used");
        
        require(msg.sender == oldAddress || owner() == msg.sender || authorizedRegistrars[msg.sender], "Not authorized");

        phoneHashToAddress[phoneHash] = newAddress;
        addressToPhoneHash[newAddress] = phoneHash;
        delete addressToPhoneHash[oldAddress];

        emit RecipientUpgraded(phoneHash, oldAddress, newAddress);
    }

    function getAddress(bytes32 phoneHash) external view returns (address) {
        return phoneHashToAddress[phoneHash];
    }

    function isRegistered(bytes32 phoneHash) external view returns (bool) {
        return phoneHashToAddress[phoneHash] != address(0);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IRecipientRegistry {
    function registerRecipient(bytes32 phoneHash, address custodialAddress) external;
    function upgradeToSelfCustody(bytes32 phoneHash, address newAddress) external;
    function getAddress(bytes32 phoneHash) external view returns (address);
    function isRegistered(bytes32 phoneHash) external view returns (bool);
}

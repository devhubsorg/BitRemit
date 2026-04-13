// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IRemittanceRouter {
    event RemittanceSent(
        address indexed sender,
        bytes32 indexed recipientHash,
        address recipientAddress,
        uint256 amount,
        string railType,
        uint256 timestamp
    );

    function sendRemittance(
        bytes32 recipientPhoneHash,
        uint256 amount,
        string calldata railType
    ) external;
}

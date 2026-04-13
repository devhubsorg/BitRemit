// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;
import {AggregatorV3Interface} from "../../src/interfaces/AggregatorV3Interface.sol";
contract MockV3Aggregator is AggregatorV3Interface {
    uint8 public decimals = 8;
    int256 public answer;

    constructor(int256 _answer) {
        answer = _answer;
    }

    function updateAnswer(int256 _answer) external {
        answer = _answer;
    }

    function latestRoundData() external view returns (uint80, int256, uint256, uint256, uint80) {
        return (1, answer, block.timestamp, block.timestamp, 1);
    }
}

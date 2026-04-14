// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract MockPriceFeed {
    int256 private price;
    uint8 private constant DECIMALS = 8;
    string private constant DESCRIPTION = "BTC / USD";
    uint256 private constant VERSION = 1;

    constructor(int256 _initialPrice) {
        price = _initialPrice;
    }

    function setPrice(int256 _price) external {
        price = _price;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (1, price, block.timestamp, block.timestamp, 1);
    }

    function decimals() external pure returns (uint8) {
        return DECIMALS;
    }

    function description() external pure returns (string memory) {
        return DESCRIPTION;
    }

    function version() external pure returns (uint256) {
        return VERSION;
    }
}
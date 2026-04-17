// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockTBTC is ERC20 {

    constructor() ERC20("Mock tBTC", "tBTC") {
        _mint(msg.sender, 100 * 1e18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MockMUSD is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("Mock Mezo USD", "MUSD") Ownable(msg.sender) {}

    function mint(address to, uint256 amount) external {
        // In a real system, only the Vault can mint. 
        // For the mock, we allow the owner or anyone for testing?
        // Let's restrict it to the owner (which will be the Vault).
        _mint(to, amount);
    }

    // burnFrom is already implemented by ERC20Burnable
}

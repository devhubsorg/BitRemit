// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {BitRemitVault} from "../../src/BitRemitVault.sol";
import {MockERC20} from "../mocks/MockERC20.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract BitRemitVaultTest is Test {
    BitRemitVault public vault;
    MockERC20 public tBTC;
    MockERC20 public mUSD;
    MockV3Aggregator public priceOracle;

    address public owner = address(1);
    address public user = address(2);
    address public liquidator = address(3);

    function setUp() public {
        tBTC = new MockERC20("Test BTC", "tBTC");
        mUSD = new MockERC20("Test MUSD", "MUSD");
        priceOracle = new MockV3Aggregator(60000e8); // 1 BTC = $60,000

        BitRemitVault impl = new BitRemitVault();
        bytes memory data = abi.encodeCall(
            BitRemitVault.initialize,
            (owner, address(tBTC), address(mUSD), address(priceOracle))
        );
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), data);
        vault = BitRemitVault(address(proxy));

        tBTC.mint(user, 10e18); // 10 BTC
        tBTC.mint(liquidator, 10e18); 
    }

    function test_DepositCollateral() public {
        vm.startPrank(user);
        tBTC.approve(address(vault), 1e18);
        vault.depositCollateral(1e18);
        vm.stopPrank();

        (uint256 col, uint256 debt, ) = vault.vaults(user);
        assertEq(col, 1e18);
        assertEq(debt, 0);
    }

    function test_BorrowMUSD() public {
        vm.startPrank(user);
        tBTC.approve(address(vault), 1e18);
        vault.depositCollateral(1e18);
        
        vm.roll(block.number + 1); // Pass flash loan guard

        // Collateral = 1e18 BTC * $60,000 = $60,000
        // Max borrow = $60,000 / 1.5 = $40,000
        vault.borrowMUSD(10000e18); // borrow 10,000 MUSD
        vm.stopPrank();

        (uint256 col, uint256 debt, ) = vault.vaults(user);
        assertEq(col, 1e18);
        assertEq(debt, 10000e18 + (10000e18 * 100 / 10000)); // +1% fee = 10100
        assertEq(mUSD.balanceOf(user), 10000e18);
    }

    function test_RevertFlashLoanGuard() public {
        vm.startPrank(user);
        tBTC.approve(address(vault), 1e18);
        vault.depositCollateral(1e18);
        
        vm.expectRevert("Flash loan guard: same block deposit");
        vault.borrowMUSD(10000e18); 
        vm.stopPrank();
    }
}

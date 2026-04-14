// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {BitRemitVault} from "../../src/BitRemitVault.sol";
import {MockERC20} from "../mocks/MockERC20.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

// Dummy V2 contract just for testing upgradeability
contract BitRemitVaultV2 is BitRemitVault {
    function version() external pure returns (uint256) {
        return 2;
    }
}

contract BitRemitVaultTest is Test {
    BitRemitVault public vault;
    MockERC20 public tBTC;
    MockERC20 public mUSD;
    MockV3Aggregator public priceOracle;

    address public owner = address(1);
    address public user = address(2);
    address public liquidator = address(3);

    event CollateralDeposited(address indexed user, uint256 amount);
    event MUSDBorrowed(address indexed user, uint256 amount);
    event MUSDRepaid(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event VaultLiquidated(address indexed user, uint256 amount);

    function setUp() public {
        tBTC = new MockERC20("Test BTC", "tBTC");
        mUSD = new MockERC20("Test MUSD", "MUSD");
        priceOracle = new MockV3Aggregator(60000e8); // $60,000 per BTC

        BitRemitVault impl = new BitRemitVault();
        bytes memory data = abi.encodeCall(
            BitRemitVault.initialize,
            (owner, address(tBTC), address(mUSD), address(priceOracle))
        );
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), data);
        vault = BitRemitVault(address(proxy));

        tBTC.mint(user, 10e18); // Give user 10 BTC
        tBTC.mint(liquidator, 10e18);
    }

    // 1. test_depositCollateral_succeeds
    function test_depositCollateral_succeeds() public {
        uint256 depositAmt = 0.05e18;
        
        vm.startPrank(user);
        tBTC.approve(address(vault), depositAmt);
        vault.depositCollateral(depositAmt);
        vm.stopPrank();

        (uint256 col, uint256 borrowed, ) = vault.vaults(user);
        assertEq(col, depositAmt);
        assertEq(borrowed, 0);
        assertEq(tBTC.balanceOf(address(vault)), depositAmt);
    }

    // 2. test_depositCollateral_emitsEvent
    function test_depositCollateral_emitsEvent() public {
        uint256 depositAmt = 0.05e18;
        
        vm.startPrank(user);
        tBTC.approve(address(vault), depositAmt);
        
        vm.expectEmit(true, false, false, true);
        emit CollateralDeposited(user, depositAmt);
        vault.depositCollateral(depositAmt);
        
        vm.stopPrank();
    }

    // 3. test_borrowMUSD_succeeds
    function test_borrowMUSD_succeeds() public {
        uint256 depositAmt = 1e18; // 1 BTC = 60,000 USD
        vm.startPrank(user);
        tBTC.approve(address(vault), depositAmt);
        vault.depositCollateral(depositAmt);
        
        vm.roll(block.number + 1); // Pass flash loan guard
        
        // 1 BTC = 60k. Max borrow = 60k / 1.5 = 40,000. We borrow 10,000.
        uint256 borrowAmt = 10000e18;
        vault.borrowMUSD(borrowAmt);
        vm.stopPrank();

        (, uint256 borrowed, ) = vault.vaults(user);
        uint256 fee = (borrowAmt * 100) / 10000;
        
        assertEq(mUSD.balanceOf(user), borrowAmt);
        assertEq(borrowed, borrowAmt + fee);
    }

    // 4. test_borrowMUSD_revertsIfOverRatio
    function test_borrowMUSD_revertsIfOverRatio() public {
        uint256 depositAmt = 1e18; // 1 BTC = 60000
        vm.startPrank(user);
        tBTC.approve(address(vault), depositAmt);
        vault.depositCollateral(depositAmt);
        vm.roll(block.number + 1);
        
        // Try to borrow 50,000 (with fee is > 40,000 max)
        vm.expectRevert("Below min collateral ratio");
        vault.borrowMUSD(50000e18);
        vm.stopPrank();
    }

    // 5. test_flashLoanGuard_revertsIfSameBlock
    function test_flashLoanGuard_revertsIfSameBlock() public {
        uint256 depositAmt = 1e18;
        vm.startPrank(user);
        tBTC.approve(address(vault), depositAmt);
        vault.depositCollateral(depositAmt);
        
        // Same block attempt:
        vm.expectRevert("Flash loan guard: same block deposit");
        vault.borrowMUSD(10000e18);
        vm.stopPrank();
    }

    // 6. test_repayMUSD_succeeds
    function test_repayMUSD_succeeds() public {
        uint256 depositAmt = 1e18;
        vm.startPrank(user);
        tBTC.approve(address(vault), depositAmt);
        vault.depositCollateral(depositAmt);
        vm.roll(block.number + 1);
        
        uint256 borrowAmt = 10000e18;
        vault.borrowMUSD(borrowAmt);
        
        uint256 totalDebt = 10100e18; // Includes 1% fee
        // Mint extra MUSD to user so they can cover the fee portion for repayment test
        mUSD.mint(user, 100e18);
        
        mUSD.approve(address(vault), totalDebt);
        vault.repayMUSD(totalDebt);
        vm.stopPrank();

        (, uint256 borrowed, ) = vault.vaults(user);
        assertEq(borrowed, 0);
    }

    // 7. test_withdrawCollateral_succeeds
    function test_withdrawCollateral_succeeds() public {
        uint256 depositAmt = 1e18;
        vm.startPrank(user);
        tBTC.approve(address(vault), depositAmt);
        vault.depositCollateral(depositAmt);
        
        vault.withdrawCollateral(0.4e18); // No debt, so withdrawing is fine
        vm.stopPrank();

        (uint256 col, , ) = vault.vaults(user);
        assertEq(col, 0.6e18);
    }

    // 8. test_withdrawCollateral_revertsIfUnsafe
    function test_withdrawCollateral_revertsIfUnsafe() public {
        uint256 depositAmt = 1e18; // = $60,000
        vm.startPrank(user);
        tBTC.approve(address(vault), depositAmt);
        vault.depositCollateral(depositAmt);
        vm.roll(block.number + 1);
        
        uint256 borrowAmt = 30000e18; // Debt will be 30,300 MUSD
        vault.borrowMUSD(borrowAmt);
        
        // Debt 30,300. Min collateral value needed = $45,450.
        // Withdrawing 0.5 BTC brings collateral to $30,000 < $45,450
        vm.expectRevert("Below min collateral ratio");
        vault.withdrawCollateral(0.5e18);
        vm.stopPrank();
    }

    // 9. test_getCollateralRatio_correct
    function test_getCollateralRatio_correct() public {
        vm.startPrank(user);
        tBTC.approve(address(vault), 1e18);
        vault.depositCollateral(1e18);
        vm.roll(block.number + 1);
        
        vault.borrowMUSD(10000e18); // Debt = 10100
        vm.stopPrank();

        uint256 ratio = vault.getCollateralRatio(user);
        // Collateral = 60,000. Debt = 10,100
        // Ratio = (60,000 * 1000) / 10,100 = 5940.59 => 5940
        assertEq(ratio, 5940);
    }

    // 10. test_getMaxBorrowable_correct
    function test_getMaxBorrowable_correct() public {
        vm.startPrank(user);
        tBTC.approve(address(vault), 1e18);
        vault.depositCollateral(1e18);
        vm.stopPrank();

        uint256 maxBorrow = vault.getMaxBorrowable(user);
        // Assert precision output given 1% fee reduction
        assertEq(maxBorrow, 39603960396039603960396);
    }

    // 11. test_liquidate_succeeds
    function test_liquidate_succeeds() public {
        vm.startPrank(user);
        tBTC.approve(address(vault), 1e18); // 60k
        vault.depositCollateral(1e18);
        vm.roll(block.number + 1);
        vault.borrowMUSD(30000e18); // Debt = 30,300. Ratio = 60k/30.3k = 1980 (198%)
        vm.stopPrank();

        // Drop price to $32,000 per BTC. Collateral value = $32k.
        // Ratio = 32k/30.3k = 105.6% (< 110%)
        priceOracle.updateAnswer(32000e8);

        // Liquidator jumps in
        vm.startPrank(liquidator);
        mUSD.mint(liquidator, 30300e18);
        mUSD.approve(address(vault), 30300e18);
        vault.liquidate(user);
        vm.stopPrank();

        (uint256 col, uint256 debt, ) = vault.vaults(user);
        assertEq(col, 0);
        assertEq(debt, 0);
        
        // Liquidator secures the 1 BTC underlying
        assertEq(tBTC.balanceOf(liquidator), 11e18); 
    }

    // 12. test_liquidate_revertsIfHealthy
    function test_liquidate_revertsIfHealthy() public {
        vm.startPrank(user);
        tBTC.approve(address(vault), 1e18); 
        vault.depositCollateral(1e18);
        vm.roll(block.number + 1);
        vault.borrowMUSD(30000e18); 
        vm.stopPrank();

        // Price is unchanged at 60k, ratio is 198% (>110%).
        vm.startPrank(liquidator);
        mUSD.mint(liquidator, 30300e18);
        mUSD.approve(address(vault), 30300e18);
        vm.expectRevert("Collateral ratio >= 1100");
        vault.liquidate(user);
        vm.stopPrank();
    }

    // 13. test_pause_blocksDeposit
    function test_pause_blocksDeposit() public {
        vm.startPrank(owner);
        vault.pause();
        vm.stopPrank();

        vm.startPrank(user);
        tBTC.approve(address(vault), 1e18); 
        vm.expectRevert(); // OZ v5 EnforcedPause
        vault.depositCollateral(1e18);
        vm.stopPrank();
    }

    // 14. test_onlyOwner_canPause
    function test_onlyOwner_canPause() public {
        vm.startPrank(user);
        vm.expectRevert(); // OZ v5 OwnableUnauthorizedAccount
        vault.pause();
        vm.stopPrank();
    }

    // 15. test_upgradeable_UUPS
    function test_upgradeable_UUPS() public {
        BitRemitVaultV2 newImpl = new BitRemitVaultV2();
        
        vm.startPrank(user);
        vm.expectRevert(); 
        vault.upgradeToAndCall(address(newImpl), "");
        vm.stopPrank();

        vm.startPrank(owner);
        vault.upgradeToAndCall(address(newImpl), "");
        vm.stopPrank();

        assertEq(BitRemitVaultV2(address(vault)).version(), 2);
    }
}

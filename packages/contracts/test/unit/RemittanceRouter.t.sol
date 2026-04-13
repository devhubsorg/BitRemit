// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {RemittanceRouter} from "../../src/RemittanceRouter.sol";
import {RecipientRegistry} from "../../src/RecipientRegistry.sol";
import {MockERC20} from "../mocks/MockERC20.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract RemittanceRouterTest is Test {
    RemittanceRouter public router;
    RecipientRegistry public registry;
    MockERC20 public mUSD;

    address public owner = address(1);
    address public user = address(2);
    address public treasury = address(3);
    address public custodialAddr = address(4);

    bytes32 public phoneHash = keccak256(abi.encodePacked("+254700000000"));

    function setUp() public {
        mUSD = new MockERC20("Test MUSD", "MUSD");

        RecipientRegistry regImpl = new RecipientRegistry();
        bytes memory regData = abi.encodeCall(RecipientRegistry.initialize, (owner));
        registry = RecipientRegistry(address(new ERC1967Proxy(address(regImpl), regData)));

        RemittanceRouter rImpl = new RemittanceRouter();
        bytes memory rData = abi.encodeCall(RemittanceRouter.initialize, (owner, address(mUSD), address(registry), treasury));
        router = RemittanceRouter(address(new ERC1967Proxy(address(rImpl), rData)));

        mUSD.mint(user, 1000e18);

        vm.startPrank(owner);
        registry.registerRecipient(phoneHash, custodialAddr);
        vm.stopPrank();
    }

    function test_SendRemittance() public {
        vm.startPrank(user);
        mUSD.approve(address(router), 100e18);
        router.sendRemittance(phoneHash, 100e18, "MPESA");
        vm.stopPrank();

        assertEq(mUSD.balanceOf(user), 900e18);
        assertEq(mUSD.balanceOf(treasury), 100e18);
    }

    function test_RevertUnregistered() public {
        bytes32 unregHash = keccak256("nope");
        vm.startPrank(user);
        mUSD.approve(address(router), 100e18);
        vm.expectRevert("Recipient not registered");
        router.sendRemittance(unregHash, 100e18, "MPESA");
        vm.stopPrank();
    }
}

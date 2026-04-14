// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {RemittanceRouter} from "../../src/RemittanceRouter.sol";
import {RecipientRegistry} from "../../src/RecipientRegistry.sol";
import {MockERC20} from "../mocks/MockERC20.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

// Dummy V2 contract
contract RemittanceRouterV2 is RemittanceRouter {
    function version() external pure returns (uint256) {
        return 2;
    }
}

contract RemittanceRouterTest is Test {
    RemittanceRouter public router;
    RecipientRegistry public registry;
    MockERC20 public mUSD;

    address public owner = address(1);
    address public user = address(2);
    address public registrar = address(3);
    address public recipientAddress = address(4);

    bytes32 public phoneHash = keccak256("phoneHash");

    event RemittanceSent(
        address indexed sender,
        bytes32 indexed recipientHash,
        address recipientAddress,
        uint256 amount,
        string railType,
        uint256 timestamp
    );

    function setUp() public {
        mUSD = new MockERC20("Test MUSD", "MUSD");

        // Registry
        RecipientRegistry regImpl = new RecipientRegistry();
        bytes memory regData = abi.encodeCall(RecipientRegistry.initialize, (owner));
        registry = RecipientRegistry(address(new ERC1967Proxy(address(regImpl), regData)));

        vm.startPrank(owner);
        registry.setAuthorizedRegistrar(registrar, true);
        vm.stopPrank();

        vm.prank(registrar);
        registry.registerRecipient(phoneHash, recipientAddress);

        // Router
        RemittanceRouter rImpl = new RemittanceRouter();
        bytes memory rData = abi.encodeCall(RemittanceRouter.initialize, (owner, address(5), address(registry), address(mUSD)));
        router = RemittanceRouter(address(new ERC1967Proxy(address(rImpl), rData)));

        mUSD.mint(user, 1000e18);
    }

    // 1
    function test_sendRemittance_succeeds() public {
        vm.startPrank(user);
        mUSD.approve(address(router), 100e18);
        router.sendRemittance(phoneHash, 100e18, "MPESA");
        vm.stopPrank();

        assertEq(mUSD.balanceOf(user), 900e18);
        assertEq(mUSD.balanceOf(recipientAddress), 100e18);
    }

    // 2
    function test_sendRemittance_revertsIfUnregistered() public {
        bytes32 unreg = keccak256("unreg");
        vm.startPrank(user);
        mUSD.approve(address(router), 100e18);
        vm.expectRevert("Recipient not registered");
        router.sendRemittance(unreg, 100e18, "MPESA");
        vm.stopPrank();
    }

    // 3
    function test_sendRemittance_revertsIfSameBlock() public {
        vm.startPrank(user);
        mUSD.approve(address(router), 1000e18);
        
        router.sendRemittance(phoneHash, 100e18, "MPESA");
        
        vm.expectRevert("Flash loan guard triggered");
        router.sendRemittance(phoneHash, 100e18, "MPESA");
        vm.stopPrank();
    }

    // 4
    function test_sendRemittance_revertsIfZeroAmount() public {
        vm.startPrank(user);
        vm.expectRevert("Amount must be > 0");
        router.sendRemittance(phoneHash, 0, "MPESA");
        vm.stopPrank();
    }

    // 5
    function test_sendRemittance_revertsIfNotApprovedMUSD() public {
        vm.startPrank(user);
        vm.expectRevert();
        router.sendRemittance(phoneHash, 100e18, "MPESA");
        vm.stopPrank();
    }

    // 6
    function test_sendRemittance_emitsEvent() public {
        vm.startPrank(user);
        mUSD.approve(address(router), 100e18);
        
        vm.expectEmit(true, true, false, true);
        emit RemittanceSent(user, phoneHash, recipientAddress, 100e18, "MPESA", block.timestamp);
        
        router.sendRemittance(phoneHash, 100e18, "MPESA");
        vm.stopPrank();
    }

    // 7
    function test_pause_blocksSend() public {
        vm.prank(owner);
        router.pause();

        vm.startPrank(user);
        mUSD.approve(address(router), 100e18);
        vm.expectRevert(); // EnforcedPause()
        router.sendRemittance(phoneHash, 100e18, "MPESA");
        vm.stopPrank();
    }

    // 8
    function test_onlyOwner_canPause() public {
        vm.prank(user);
        vm.expectRevert();
        router.pause();
    }

    // 9
    function test_upgradeable_UUPS() public {
        RemittanceRouterV2 newImpl = new RemittanceRouterV2();
        
        vm.prank(user);
        vm.expectRevert();
        router.upgradeToAndCall(address(newImpl), "");

        vm.prank(owner);
        router.upgradeToAndCall(address(newImpl), "");
        
        assertEq(RemittanceRouterV2(address(router)).version(), 2);
    }

    // 10
    function test_constructor_disablesInitializers() public {
        RemittanceRouter rawImpl = new RemittanceRouter();
        vm.expectRevert(); // InvalidInitialization()
        rawImpl.initialize(owner, address(1), address(1), address(1));
    }
}

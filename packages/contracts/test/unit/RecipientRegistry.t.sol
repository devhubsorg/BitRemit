// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {RecipientRegistry} from "../../src/RecipientRegistry.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract RecipientRegistryTest is Test {
    RecipientRegistry public registry;
    address public owner = address(1);
    address public registrar = address(2);
    address public nonRegistrar = address(3);

    bytes32 public hash1 = keccak256("hash1");
    bytes32 public hash2 = keccak256("hash2");

    event RecipientRegistered(bytes32 indexed phoneHash, address custodialAddress);
    event RecipientUpgraded(bytes32 indexed phoneHash, address oldAddress, address newAddress);

    function setUp() public {
        RecipientRegistry impl = new RecipientRegistry();
        bytes memory data = abi.encodeCall(RecipientRegistry.initialize, (owner));
        registry = RecipientRegistry(address(new ERC1967Proxy(address(impl), data)));

        vm.prank(owner);
        registry.setAuthorizedRegistrar(registrar, true);
    }

    // 1
    function test_setAuthorizedRegistrar_succeeds() public {
        vm.prank(owner);
        registry.setAuthorizedRegistrar(address(4), true);
        assertTrue(registry.authorizedRegistrars(address(4)));
    }

    // 2
    function test_setAuthorizedRegistrar_revertsIfNotOwner() public {
        vm.prank(nonRegistrar);
        vm.expectRevert();
        registry.setAuthorizedRegistrar(address(4), true);
    }

    // 3
    function test_registerRecipient_succeeds() public {
        vm.prank(registrar);
        registry.registerRecipient(hash1, address(100));
        assertTrue(registry.isRegistered(hash1));
        assertEq(registry.getAddress(hash1), address(100));
        assertEq(registry.addressToPhoneHash(address(100)), hash1);
    }

    // 4
    function test_registerRecipient_revertsIfAlreadyRegistered() public {
        vm.startPrank(registrar);
        registry.registerRecipient(hash1, address(100));
        vm.expectRevert("Already registered");
        registry.registerRecipient(hash1, address(101));
        vm.stopPrank();
    }

    // 5
    function test_registerRecipient_revertsIfAddressUsed() public {
        vm.startPrank(registrar);
        registry.registerRecipient(hash1, address(100));
        vm.expectRevert("Address already used");
        registry.registerRecipient(hash2, address(100));
        vm.stopPrank();
    }

    // 6
    function test_registerRecipient_revertsIfNotRegistrar() public {
        vm.prank(nonRegistrar);
        vm.expectRevert("Not authorized registrar");
        registry.registerRecipient(hash1, address(100));
    }

    // 7
    function test_upgradeToSelfCustody_succeeds() public {
        vm.prank(registrar);
        registry.registerRecipient(hash1, address(100));

        vm.prank(address(100));
        registry.upgradeToSelfCustody(hash1, address(101));

        assertEq(registry.getAddress(hash1), address(101));
        assertEq(registry.addressToPhoneHash(address(101)), hash1);
        assertEq(registry.addressToPhoneHash(address(100)), bytes32(0));
    }

    // 8
    function test_upgradeToSelfCustody_revertsIfUnregistered() public {
        vm.prank(address(100));
        vm.expectRevert("Not registered");
        registry.upgradeToSelfCustody(hash1, address(101));
    }

    // 9
    function test_upgradeToSelfCustody_revertsIfUnauthorized() public {
        vm.prank(registrar);
        registry.registerRecipient(hash1, address(100));

        vm.prank(nonRegistrar);
        vm.expectRevert("Not authorized");
        registry.upgradeToSelfCustody(hash1, address(101));
    }

    // 10
    function test_upgradeToSelfCustody_revertsIfNewAddressUsed() public {
        vm.startPrank(registrar);
        registry.registerRecipient(hash1, address(100));
        registry.registerRecipient(hash2, address(101));
        
        vm.expectRevert("New address already used");
        registry.upgradeToSelfCustody(hash1, address(101));
        vm.stopPrank();
    }
}

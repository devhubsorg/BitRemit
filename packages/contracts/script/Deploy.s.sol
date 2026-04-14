// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {BitRemitVault} from "../src/BitRemitVault.sol";
import {RemittanceRouter} from "../src/RemittanceRouter.sol";
import {RecipientRegistry} from "../src/RecipientRegistry.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {MockPriceFeed} from "../src/mocks/MockPriceFeed.sol";

contract Deploy is Script {
    function run() external {
        // 1. Read from environment variables
        uint256 deployerPrivateKey = vm.envUint("BACKEND_SIGNER_PRIVATE_KEY");
        address tBtcAddress = vm.envAddress("TBTC_ADDRESS");
        address musdAddress = vm.envAddress("MUSD_ADDRESS"); // 0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503
        
        // Deploy MockPriceFeed
        MockPriceFeed mockFeed = new MockPriceFeed(65000 * 1e8); // BTC = $65,000
        address priceFeedAddress = address(mockFeed);
        console.log("MockPriceFeed deployed at:", priceFeedAddress);
        
        address owner = vm.addr(deployerPrivateKey);

        console.log("Running deployment with Deployer:", owner);

        vm.startBroadcast(deployerPrivateKey);

        // 2. Deploy RecipientRegistry via ERC1967Proxy
        RecipientRegistry registryImpl = new RecipientRegistry();
        bytes memory regData = abi.encodeCall(RecipientRegistry.initialize, (owner));
        RecipientRegistry registry = RecipientRegistry(
            address(new ERC1967Proxy(address(registryImpl), regData))
        );
        console.log("RecipientRegistry Proxy deployed mapped to:", address(registry));

        // 3. Deploy BitRemitVault via ERC1967Proxy
        BitRemitVault vaultImpl = new BitRemitVault();
        bytes memory vaultData = abi.encodeCall(
            BitRemitVault.initialize,
            (owner, tBtcAddress, musdAddress, priceFeedAddress)
        );
        BitRemitVault vault = BitRemitVault(
            address(new ERC1967Proxy(address(vaultImpl), vaultData))
        );
        console.log("BitRemitVault Proxy deployed mapped to:", address(vault));

        // 4. Deploy RemittanceRouter via ERC1967Proxy
        // Requires vault, registry, musd tokens natively injected as requested
        RemittanceRouter routerImpl = new RemittanceRouter();
        bytes memory routerData = abi.encodeCall(
            RemittanceRouter.initialize,
            (owner, address(vault), address(registry), musdAddress)
        );
        RemittanceRouter router = RemittanceRouter(
            address(new ERC1967Proxy(address(routerImpl), routerData))
        );
        console.log("RemittanceRouter Proxy deployed mapped to:", address(router));

        // 5. Call setAuthorizedRegistrar
        registry.setAuthorizedRegistrar(address(router), true);
        console.log("Authorized RemittanceRouter inside RecipientRegistry securely.");

        vm.stopBroadcast();

        // 6. Write final Proxy and Impl addresses to JSON output file
        string memory json = "deployment";
        vm.serializeAddress(json, "recipientRegistryImpl", address(registryImpl));
        vm.serializeAddress(json, "recipientRegistryProxy", address(registry));
        vm.serializeAddress(json, "bitRemitVaultImpl", address(vaultImpl));
        vm.serializeAddress(json, "bitRemitVaultProxy", address(vault));
        vm.serializeAddress(json, "remittanceRouterImpl", address(routerImpl));
        string memory finalJson = vm.serializeAddress(json, "remittanceRouterProxy", address(router));

        vm.writeJson(finalJson, "./DeploymentAddresses.json");
        console.log("Successfully persisted deployment details to DeploymentAddresses.json.");
    }
}
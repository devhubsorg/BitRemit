// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockPriceFeed} from "../src/mocks/MockPriceFeed.sol";
import {BitRemitVault} from "../src/BitRemitVault.sol";

contract DeployMockPriceFeed is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address vaultProxyAddress = vm.envAddress("VAULT_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        MockPriceFeed feed = new MockPriceFeed(65000 * 1e8);
        console.log("MockPriceFeed deployed at:", address(feed));

        BitRemitVault proxy = BitRemitVault(vaultProxyAddress);
        proxy.setPriceOracle(address(feed));
        console.log("Vault PriceOracle updated.");

        vm.stopBroadcast();
    }
}

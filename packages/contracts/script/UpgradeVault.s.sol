// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {BitRemitVault} from "../src/BitRemitVault.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract UpgradeVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address vaultProxyAddress = vm.envAddress("VAULT_ADDRESS");
        address newTBtcAddress = vm.envAddress("TBTC_ADDRESS");

        console.log("Upgrading Vault at:", vaultProxyAddress);

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy new implementation
        BitRemitVault newImpl = new BitRemitVault();
        console.log("New Implementation deployed at:", address(newImpl));

        // 2. Upgrade the proxy
        BitRemitVault proxy = BitRemitVault(vaultProxyAddress);
        proxy.upgradeToAndCall(address(newImpl), "");
        console.log("Vault Proxy upgraded.");

        // 3. Set the new tBTC token address
        proxy.setTBtcToken(newTBtcAddress);
        console.log("Vault tBtcToken updated to:", newTBtcAddress);

        vm.stopBroadcast();
    }
}

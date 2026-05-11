// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockMUSD} from "../src/mocks/MockMUSD.sol";
import {BitRemitVault} from "../src/BitRemitVault.sol";

contract DeployMockMUSD is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address vaultProxyAddress = vm.envAddress("VAULT_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        MockMUSD musd = new MockMUSD();
        console.log("MockMUSD deployed at:", address(musd));

        BitRemitVault vault = BitRemitVault(vaultProxyAddress);
        vault.setMusdToken(address(musd));
        console.log("Vault MUSD address updated.");

        vm.stopBroadcast();
    }
}

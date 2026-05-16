// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {RemittanceRouter} from "../src/RemittanceRouter.sol";

contract UpgradeRouter is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address routerProxyAddress = 0xb03843007F051c73b739a0CCe126c5Ed45E7626e;
        address musdToken = 0x36754a9235Dd4817A48C136A8D0F830510B5109A;

        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy new implementation
        RemittanceRouter newImpl = new RemittanceRouter();
        console.log("New Router implementation deployed at:", address(newImpl));

        // 2. Upgrade the proxy
        RemittanceRouter proxy = RemittanceRouter(routerProxyAddress);
        proxy.upgradeToAndCall(address(newImpl), "");
        console.log("Router proxy upgraded.");

        // 3. Update MUSD token
        proxy.setMusdToken(musdToken);
        console.log("Router MUSD token updated to:", musdToken);

        vm.stopBroadcast();
    }
}

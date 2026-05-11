// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {MockTBTC} from "../src/mocks/MockTBTC.sol";

contract DeployMockTBTC is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying MockTBTC with deployer:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        MockTBTC tbtc = new MockTBTC();
        console.log("MockTBTC deployed at:", address(tbtc));

        // Mint some more for the deployer if needed
        tbtc.mint(deployer, 1000 * 1e18);
        console.log("Minted 1000 tBTC to deployer");

        vm.stopBroadcast();
    }
}

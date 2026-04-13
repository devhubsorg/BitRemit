// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IBitRemitVault {
    struct Vault {
        uint256 collateralAmount;
        uint256 borrowedMUSD;
        uint256 lastUpdated;
    }

    event CollateralDeposited(address indexed user, uint256 amount);
    event MUSDBorrowed(address indexed user, uint256 amount);
    event MUSDRepaid(address indexed user, uint256 amount);
    event CollateralWithdrawn(address indexed user, uint256 amount);
    event VaultLiquidated(address indexed user, uint256 amount);

    function initialize(
        address initialOwner,
        address _tBtcToken,
        address _musdToken,
        address _priceOracle
    ) external;

    function depositCollateral(uint256 amount) external;
    function borrowMUSD(uint256 amount) external;
    function repayMUSD(uint256 amount) external;
    function withdrawCollateral(uint256 amount) external;
    function getCollateralRatio(address user) external view returns (uint256);
    function getMaxBorrowable(address user) external view returns (uint256);
    function liquidate(address user) external;
}

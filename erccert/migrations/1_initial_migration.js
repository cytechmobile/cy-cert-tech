const CyCertToken = artifacts.require("CyCertToken")

module.exports = function (deployer) {
    deployer.deploy(CyCertToken);
};
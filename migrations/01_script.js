// Import du smart contract Voting
const Voting = artifacts.require("Voting");

// Déploiement du smart contract
module.exports = function (deployer) {
  deployer.deploy(Voting);
};
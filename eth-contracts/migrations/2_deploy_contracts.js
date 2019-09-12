const Verifier = artifacts.require("Verifier");
const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const proof_2_4 = require('../../zokrates/code/square/2_4/proof.json');
const proof_3_9 = require('../../zokrates/code/square/3_9/proof.json');
const proof_4_16 = require('../../zokrates/code/square/4_16/proof.json');
const proof_5_25 = require('../../zokrates/code/square/5_25/proof.json');
const proof_6_36 = require('../../zokrates/code/square/6_36/proof.json');
const proof_7_49 = require('../../zokrates/code/square/7_49/proof.json');
const proof_8_64 = require('../../zokrates/code/square/8_64/proof.json');
const proof_9_81 = require('../../zokrates/code/square/9_81/proof.json');
const proof_10_100 = require('../../zokrates/code/square/10_100/proof.json');
const proof_11_121 = require('../../zokrates/code/square/11_121/proof.json');
const proofs = {};
proofs[2] = proof_2_4;
proofs[3] = proof_3_9;
proofs[4] = proof_4_16;
proofs[5] = proof_5_25;
proofs[6] = proof_6_36;
proofs[7] = proof_7_49; 
proofs[8] = proof_8_64;
proofs[9] = proof_9_81;
proofs[10] = proof_10_100;
proofs[11] = proof_11_121;

module.exports = async function(deployer) {
  deployer.deploy(Verifier)
    .then(() => deployer.deploy(Capstones))
    .then(() => deployer.deploy(SolnSquareVerifier, Verifier.address))
    .then(() => SolnSquareVerifier.deployed())
    .then(async solnSquareVerifier => {
      for (i = 2; i <= 11; i++) {
        let { proof, inputs } = proofs[i];
        let { a, b, c } = proof;
        let tokenId = i * i;
        await solnSquareVerifier.mintCapstone(tokenId, a, b, c, inputs);
      }
    })
};

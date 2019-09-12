const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const Verifier = artifacts.require('Verifier');
const proofData = require('../../zokrates/code/square/0/proof.json');

const { proof, inputs } = proofData;
const { a, b, c } = proof;

contract('TestSolnSquareVerifier', async accounts => {
    const alice = accounts[0];
    const bob = accounts[1];


    describe('test integration of ZK proof & ERC721', async function () {
        
        beforeEach(async function () { 
            const verifierContract = await Verifier.new();
            this.contract = await SolnSquareVerifier.new(verifierContract.address);
        })

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint an ERC721 token', async function () {
            
            // ARRANGE
            let tokenId = 23;
            let expectedTokenOwner = alice;
            let initialSupply = await this.contract.totalSupply.call();
            let solutionsBefore = await this.contract.getLengthOfSolutionsArray.call();

            // ACT
            await this.contract.mintCapstone(tokenId, a, b, c, inputs, { from: alice });
            let newTokenOwner = await this.contract.ownerOf.call(tokenId);
            let newSupply = await this.contract.totalSupply.call();

            // ASSERT
            assert(newTokenOwner == expectedTokenOwner, "Should mint token to Alice.");
            assert(newSupply.toNumber() == initialSupply.toNumber() + 1, "Should increment supply by one.");

            // Test if a new solution can be added for contract - SolnSquareVerifier
            let solutionsAfter = await this.contract.getLengthOfSolutionsArray.call();
            assert(solutionsAfter.toNumber() == solutionsBefore.toNumber() + 1, "Should increment solutions array.");

            // Minting twice should fail
            let expected = 0;
            let actual = 0;
            try {
                await this.contract.mint(tokenId, a, b, c, inputs, { from: alice });
                actual++; 
            }
            catch(e) { assert(e, "Should revert on double minting") }
            finally {
                assert(actual == expected, "Should revert and throw on double minting");
            }
            
        })

    })

});

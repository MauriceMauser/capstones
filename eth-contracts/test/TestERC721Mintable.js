const Capstones = artifacts.require('Capstones');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const TOKEN_SUPPLY = 10;

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await Capstones.new({from: account_one});

            // TODO: mint multiple tokens
            for (i = 0; i < TOKEN_SUPPLY; i++) {
                // await this.contract.mint(account_one, i, `https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/${i}`);
                await this.contract.mint(account_one, i);
            }
        })

        it('should return total supply', async function () {
            // ARRANGE
            let numberOfTokensMinted = TOKEN_SUPPLY;
            // ACT
            let totalSupply = await this.contract.totalSupply.call();
            // ASSERT
            assert(totalSupply > 0, "Total Supply should be a nonnegative amount.");
            assert(totalSupply == numberOfTokensMinted, "Total Supply should equal the number of coins minted.");
        })

        it('should get token balance', async function () { 
            // ARRANGE
            let expectedTokenBalanceOfAccountOne = TOKEN_SUPPLY;
            // ACT
            let tokenBalanceOfAccountOne = await this.contract.balanceOf.call(account_one);
            // ASSERT
            assert(tokenBalanceOfAccountOne > 0, "Should be a positive token balance.");
            assert(tokenBalanceOfAccountOne == expectedTokenBalanceOfAccountOne, "Balance should equal the expected amount.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            // ARRANGE
            let tokenId = 1;
            let expectedTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1";
            // ACT
            let tokenURI = await this.contract.tokenURI.call(tokenId);
            // ASSERT
            assert(tokenURI == expectedTokenURI, "Token URI does not match the expected value.");
        })

        it('should transfer token from one owner to another', async function () { 
            // ARRANGE
            let receiver = account_two;
            let balanceOfFirstOwnerBeforeTx = await this.contract.balanceOf.call(account_one);
            let tokenId = 1;
            // ACT
            await this.contract.transferFrom(account_one, account_two, tokenId, { from: account_one });
            let balanceOfFirstOwnerAfterTx = await this.contract.balanceOf.call(account_one);
            let newOwner = await this.contract.ownerOf.call(tokenId);
            // ASSERT
            assert(balanceOfFirstOwnerAfterTx == balanceOfFirstOwnerBeforeTx - 1, "Transfer failed: Should reduce balance of prior owner.");
            assert(newOwner == receiver, "Transfer failed: New owner does not match the expected owner.");
            // but fails if initiated from unauthorized contract
            let ownerOfTwo = await this.contract.ownerOf.call(2);
            let ownerOfThree = await this.contract.ownerOf.call(3);
            let ownerOfFour = await this.contract.ownerOf.call(4);
            try {
                await this.contract.transferFrom(account_one, account_two, 2, { from: account_two });
            }
            catch(e) { assert(e, "[2] Should revert on invalid transfers"); }
            try { 
                await this.contract.transferFrom(account_two, account_one, 3, { from: account_two }); 
            }
            catch(e) { assert(e, "[3] Should revert on invalid transfers"); }
            try { 
                await this.contract.transferFrom(account_two, account_one, 4, { from: account_one }); 
            }
            catch(e) { assert(e, "[4] Should revert on invalid transfers"); }
            finally {
                let ownerOfTwoAfter = await this.contract.ownerOf.call(2);
                assert(ownerOfTwoAfter == ownerOfTwo, "[2] Ownership should not change");
                let ownerOfThreeAfter = await this.contract.ownerOf.call(3);
                assert(ownerOfTwoAfter == ownerOfTwo, "[3] Ownership should not change");
                let ownerOfFourAfter = await this.contract.ownerOf.call(4);
                assert(ownerOfTwoAfter == ownerOfTwo, "[4] Ownership should not change");
            }
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await Capstones.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            // ARRANGE
            let invalidAddress = account_two;
            let totalSupplyBefore = await this.contract.totalSupply.call();
            // ACT
            try {
                await this.contract.mint(invalidAddress, 11, { 
                    from: account_two
                });
            }
            catch(e) { assert(e, "Mint should revert and throw"); }
            finally {
                let totalSupplyAfter = await this.contract.totalSupply.call();
                // ASSERT
                assert(totalSupplyBefore.toNumber() == totalSupplyAfter.toNumber(), "Mint should fail and not alter the supply.");
            }
            await this.contract.mint(invalidAddress, 12, { 
                from: account_one
            });
            // but works if send from owner
            let totalSupplyAfterValidMint = await this.contract.totalSupply.call();
            assert(totalSupplyAfterValidMint.toNumber() == totalSupplyBefore + 1, "Valid mint should increment supply");
        })

        it('should return contract owner', async function () { 
            // ARRANGE
            let expectedContractOwner = account_one;
            // ACT
            let contractOwner = await this.contract.getOwner.call();
            // ASSERT
            assert(contractOwner == expectedContractOwner, "Contract owner does not match the expected value.");
        })

    });
})

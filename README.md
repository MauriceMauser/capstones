# Capstones

#### Udacity Blockchain Developer Nanodegree

Capstones are ERC721 Non-Fungible Tokens that represent real estate titles.

## Zero-Knowledge Proofs with Zokrates

Their ownership is proven via zero-knowledge proofs, which have been created with [Zokrates](https://zokrates.github.io/sha256example.html).
(For simplicity's sake, proofs in this project are restricted to merely showing that you know the square of a number.)

## Capstones Storefront on OpenSea

The tokens are listed in an OpenSea storefront on the Rinkeby Ethereum test network.

* [Capstones Store](https://rinkeby.opensea.io/assets/capstones-4)

10 Tokens have been listed, 5 of which have been purchased by [0x0306332bfc0529bb87a94c9d2494b28ed924149b](https://rinkeby.opensea.io/accounts/0x0306332bfc0529bb87a94c9d2494b28ed924149b).


## Contract ABI

The main contract can be found at [0x4501bf2ebbc8ff772b8b4ea9ef0673dc17e45fb8](https://rinkeby.etherscan.io/address/0x4501bf2ebbc8ff772b8b4ea9ef0673dc17e45fb8).

To **mint** a token, first generate a proof via Zokrates (that shows that you know the square of a number).

Then, extract *a*, *b*, *c*, and *inputs* from your **proof.json** to pass them along to **mintCapstone** after providing a tokenId.

```
solnSquareVerifier.mintCapstone(tokenId, a, b, c, inputs)
```

This will mint a new token, given the proof is unique and correct.

To verify correctness, the [Verifier contract](https://rinkeby.etherscan.io/address/0x197c169f2f6b6ada46059271d951dcbd2418e59c) is invoked internally.


## How to Test

1. Let npm install these modules:

* OpenZeppelin-Solidity ^2.2.0
* Solidity ^0.5.2
* Truffle ^5.0.35
* Truffle HD Wallet Provider ^1.0.0-web3one.5

```
npm install
```

2. Navigate to *eth-contracts* and open the Truffle console.

```
cd eth-contracts
truffle develop
```

3. Compile the Verifier, ERC721 and SolnSquareVerifier contracts.

```
compile
```

4. Deploy the Verifier, Capstones and SolnSquareVerifier contracts. This will also create 10 tokens for us, with verified proofs.

```
migrate
```

5. Test **ERC721Mintable**

```
test ./test/TestERC721Mintable.js
```

6. Test **TestSquareVerifier**

```
test ./test/TestSquareVerifier.js
```

7. Test **TestSolnSquareVerifier**

```
test ./test/TestSolnSquareVerifier.js
```

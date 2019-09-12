pragma solidity >=0.4.21 <0.6.0;

import './ERC721Mintable.sol';

// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is Capstones {

    // Create an event to emit when a solution is added
    event SolutionAdded(bytes32 solutionKey, address submittedBy);

    // TODO define a solution struct that can hold an index & an address
    struct Solution {
        uint[2] a;
        uint[2][2] b;
        uint[2] c;
        uint[2] input;
        bytes32 solutionKey; // keccak256(abi.encodePacked(a,b,c,input))
        address submittedBy;
    }

    // define an array of the above struct
    Solution[] private solutions;

    // define a mapping to store unique solutions submitted
    mapping(bytes32 => bool) private submitted;

    Verifier squareVerifier;

    constructor
                (
                    address verifierContract
                )
                public
    {
        squareVerifier = Verifier(verifierContract);
    }

    // TODO Create a function to add the solutions to the array and emit the event
    function _addSolution
                        (
                            uint[2] memory a,
                            uint[2][2] memory b,
                            uint[2] memory c,
                            uint[2] memory input
                        )
                        internal
    {
        Solution memory solution;
        solution.a = a;
        solution.b = b;
        solution.c = c;
        solution.input = input;
        
        bytes32 solutionKey = _getSolutionKey(a, b, c, input);
        solution.solutionKey = solutionKey;
        solution.submittedBy = msg.sender;

        submitted[solutionKey] = true;
        solutions.push(solution);
        emit SolutionAdded(solutionKey, msg.sender);
    }

    function _getSolutionKey
                            (
                                uint[2] memory a,
                                uint[2][2] memory b,
                                uint[2] memory c,
                                uint[2] memory input
                            )
                            internal
                            pure
                            returns(bytes32 solutionKey)
    {
        solutionKey = keccak256(abi.encodePacked(a, b, c, input));
    }

    function getLengthOfSolutionsArray () public view returns(uint256) {
        return solutions.length;
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSupply
    function mintCapstone
                        (
                            uint256 tokenId,
                            uint[2] memory a,
                            uint[2][2] memory b,
                            uint[2] memory c,
                            uint[2] memory input
                        )
                        public
    {
        bytes32 solutionKey = _getSolutionKey(a, b, c, input);
        require(!submitted[solutionKey], "Invalid submission: Duplicate solution.");
        bool correct = squareVerifier.verifyTx(a, b, c, input);
        require(correct, "Invalid proof: Rejected by verifier.");
        _addSolution(a, b, c, input);
        mint(msg.sender, tokenId);
    }

}

// define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
interface Verifier {

    function verifyTx
                    (
                        uint[2] calldata a,
                        uint[2][2] calldata b,
                        uint[2] calldata c,
                        uint[2] calldata input
                    )
                    external
                    returns (bool r);

}

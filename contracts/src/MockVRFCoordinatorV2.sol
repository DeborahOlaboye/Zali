// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockVRFCoordinatorV2
 * @dev Improved Mock VRF Coordinator for Celo
 * This version stores requests and fulfills them in a separate transaction
 * to properly simulate async VRF behavior
 */
contract MockVRFCoordinatorV2 {
    uint256 private nonce;
    
    struct Request {
        address requester;
        uint32 numWords;
        bool fulfilled;
    }
    
    mapping(uint256 => Request) public requests;
    
    event RandomWordsRequested(
        bytes32 indexed keyHash,
        uint256 requestId,
        uint256 preSeed,
        uint64 indexed subId,
        uint16 minimumRequestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords,
        address indexed sender
    );
    
    event RandomWordsFulfilled(
        uint256 indexed requestId,
        uint256 outputSeed,
        uint96 payment,
        bool success
    );
    
    /**
     * @dev Request random words (stores request for later fulfillment)
     */
    function requestRandomWords(
        bytes32 keyHash,
        uint64 subId,
        uint16 minimumRequestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords
    ) external returns (uint256 requestId) {
        requestId = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender,
            nonce++
        )));
        
        requests[requestId] = Request({
            requester: msg.sender,
            numWords: numWords,
            fulfilled: false
        });
        
        emit RandomWordsRequested(
            keyHash,
            requestId,
            0,
            subId,
            minimumRequestConfirmations,
            callbackGasLimit,
            numWords,
            msg.sender
        );
        
        // Auto-fulfill immediately (simulating instant VRF)
        _fulfillRequest(requestId);
        
        return requestId;
    }
    
    /**
     * @dev Internal function to fulfill a request
     */
    function _fulfillRequest(uint256 requestId) internal {
        Request storage request = requests[requestId];
        require(request.requester != address(0), "Request not found");
        require(!request.fulfilled, "Already fulfilled");
        
        // Generate pseudo-random words
        uint256[] memory randomWords = new uint256[](request.numWords);
        for (uint256 i = 0; i < request.numWords; i++) {
            randomWords[i] = uint256(keccak256(abi.encodePacked(
                requestId,
                i,
                block.timestamp,
                block.prevrandao,
                blockhash(block.number - 1)
            )));
        }
        
        request.fulfilled = true;
        
        // Call the consumer's callback
        try IVRFConsumer(request.requester).rawFulfillRandomWords(requestId, randomWords) {
            emit RandomWordsFulfilled(requestId, 0, 0, true);
        } catch {
            emit RandomWordsFulfilled(requestId, 0, 0, false);
            revert("Callback failed");
        }
    }
    
    /**
     * @dev Manual fulfill function (for testing/debugging)
     */
    function fulfillRequest(uint256 requestId) external {
        _fulfillRequest(requestId);
    }
}

/**
 * @dev Interface for VRF consumer
 */
interface IVRFConsumer {
    function rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords) external;
}

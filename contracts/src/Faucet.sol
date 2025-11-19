// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Faucet
 * @dev A contract that distributes test cUSD tokens to users (one-time claim)
 */
contract Faucet is Ownable, ReentrancyGuard {
    IERC20 public cUSDToken;
    uint256 public constant CLAIM_AMOUNT = 10 * 10**18; // 10 cUSD (18 decimals)
    mapping(address => bool) public hasClaimed;

    event TokensClaimed(address indexed recipient, uint256 amount);
    event TokensWithdrawn(address indexed owner, uint256 amount);

    /**
     * @dev Constructor sets the cUSD token address
     * @param _cUSDTokenAddress Address of the cUSD token contract
     */
    constructor(address _cUSDTokenAddress) Ownable(msg.sender) {
        require(_cUSDTokenAddress != address(0), "Invalid token address");
        cUSDToken = IERC20(_cUSDTokenAddress);
    }

    /**
     * @dev Allows users to claim their test cUSD tokens (one-time only)
     */
    function claim() external nonReentrant {
        require(!hasClaimed[msg.sender], "Already claimed");
        require(
            cUSDToken.balanceOf(address(this)) >= CLAIM_AMOUNT,
            "Insufficient contract balance"
        );

        hasClaimed[msg.sender] = true;
        require(
            cUSDToken.transfer(msg.sender, CLAIM_AMOUNT),
            "Transfer failed"
        );

        emit TokensClaimed(msg.sender, CLAIM_AMOUNT);
    }

    /**
     * @dev Allows the owner to withdraw any remaining cUSD tokens
     * @param amount Amount of tokens to withdraw
     */
    function withdrawTokens(uint256 amount) external onlyOwner {
        require(
            cUSDToken.balanceOf(address(this)) >= amount,
            "Insufficient balance"
        );
        require(cUSDToken.transfer(owner(), amount), "Transfer failed");
        emit TokensWithdrawn(owner(), amount);
    }

    /**
     * @dev Returns the contract's cUSD balance
     */
    function getContractBalance() external view returns (uint256) {
        return cUSDToken.balanceOf(address(this));
    }

    /**
     * @dev Checks if an address has already claimed tokens
     * @param user Address to check
     * @return bool True if the address has claimed tokens, false otherwise
     */
    function hasUserClaimed(address user) external view returns (bool) {
        return hasClaimed[user];
    }
}

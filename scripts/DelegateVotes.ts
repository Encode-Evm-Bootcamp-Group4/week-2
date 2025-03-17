import { createPublicClient, http, createWalletClient, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const voterPrivateKey = process.env.PRIVATE_KEY || "";
const contractAddress = process.env.CONTRACT_ADDRESS || "";

async function main() {

  const delegateAddress = process.argv[2];
  if (!delegateAddress) throw new Error("Delegate address not provided");

  // Setup clients
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const account = privateKeyToAccount(`0x${voterPrivateKey}`);
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  // Check delegator's status
  const delegator = await publicClient.readContract({
    address: contractAddress as Address,
    abi,
    functionName: 'voters',
    args: [account.address],
  }) as [bigint, boolean, string, bigint];

  console.log('Delegator status:', {
    address: account.address,
    weight: delegator[0].toString(),
    voted: delegator[1],
    delegate: delegator[2],
    vote: delegator[3].toString()
  });

  // Check if delegator can delegate
  if (!delegator[0]) {
    throw new Error(`Account ${account.address} does not have voting rights`);
  }

  if (delegator[1]) {
    throw new Error(`Account ${account.address} has already voted`);
  }

  if (delegator[2] !== "0x0000000000000000000000000000000000000000") {
    throw new Error(`Account ${account.address} has already delegated`);
  }

  // Check delegate's status
  const delegate = await publicClient.readContract({
    address: contractAddress as Address,
    abi,
    functionName: 'voters',
    args: [delegateAddress as Address],
  }) as [bigint, boolean, string, bigint];

  console.log('Delegate status:', {
    address: delegateAddress,
    weight: delegate[0].toString(),
    voted: delegate[1],
    delegate: delegate[2],
    vote: delegate[3].toString()
  });

  // Check if delegate can receive delegation
  if (!delegate[0]) {
    throw new Error(`Delegate ${delegateAddress} does not have voting rights`);
  }

  console.log(`Delegating vote to ${delegateAddress}...`);
  console.log(`Using contract at address: ${contractAddress}`);
  
  // Delegate vote
  const hash = await walletClient.writeContract({
    address: contractAddress as Address,
    abi,
    functionName: 'delegate',
    args: [delegateAddress as Address],
  });

  console.log("Transaction hash:", hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);

  // Check final delegation status
  const finalStatus = await publicClient.readContract({
    address: contractAddress as Address,
    abi,
    functionName: 'voters',
    args: [account.address],
  }) as [bigint, boolean, string, bigint];

  console.log('Final delegator status:', {
    address: account.address,
    weight: finalStatus[0].toString(),
    voted: finalStatus[1],
    delegate: finalStatus[2],
    vote: finalStatus[3].toString()
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
import { createPublicClient, http, createWalletClient, Address } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";
const contractAddress = process.env.CONTRACT_ADDRESS || "";

async function main() {
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  console.log("Deployer/Chairperson address:", account.address);
  
  const voterAddress = process.argv[2];
  if (!voterAddress) throw new Error("Voter address not provided");

  // Setup clients
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });


  // for testing - check voter status
  const voter = await publicClient.readContract({
    address: contractAddress as Address,
    abi,
    functionName: 'voters',
    args: [voterAddress as Address],
  }) as [bigint, boolean, string, bigint];

  console.log('Current voter status:', {
    weight: voter[0].toString(),
    voted: voter[1],
    delegate: voter[2],
    vote: voter[3].toString()
  });

  if (voter[0] > 0n) {
    console.log("This address already has voting rights!");
    return;
  }

  if (voter[1]) {
    console.log("This address has already voted!");
    return;
  }

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });



  
  // for testing - check if the caller is chairperson
  const chairperson = await publicClient.readContract({
    address: contractAddress as Address,
    abi,
    functionName: 'chairperson',
  }) as Address;

  if (account.address.toLowerCase() !== chairperson.toLowerCase()) {
    throw new Error(`Only the chairperson (${chairperson}) can give voting rights. Your address: ${account.address}`);
  }

  console.log(`Giving voting rights to ${voterAddress}...`);
  console.log(`Using contract at address: ${contractAddress}`);
  
  // Give voting rights
  const hash = await walletClient.writeContract({
    address: contractAddress as Address,
    abi,
    functionName: 'giveRightToVote',
    args: [voterAddress as Address],
  });

  console.log("Transaction hash:", hash);
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log("Transaction confirmed in block:", receipt.blockNumber);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
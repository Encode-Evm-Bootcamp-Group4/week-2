import { createPublicClient, http, Address } from "viem";
import { sepolia } from "viem/chains";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";
import * as dotenv from "dotenv";
dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const contractAddress = process.env.CONTRACT_ADDRESS || "";

async function main() {
  // Setup client
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });

  const voterAddress = process.argv[2];

  // Get chairperson 
  const chairperson = await publicClient.readContract({
    address: contractAddress as Address,
    abi,
    functionName: 'chairperson',
  }) as Address;

  console.log("\nChairperson:", chairperson);

// Get voter address info
  if (voterAddress) {
    const voter = await publicClient.readContract({
      address: contractAddress as Address,
      abi,
      functionName: 'voters',
      args: [voterAddress as Address],
    }) as [bigint, boolean, string, bigint];

    console.log('\nVoter status:', {
      address: voterAddress,
      weight: voter[0].toString(),
      voted: voter[1],
      delegate: voter[2],
      vote: voter[3].toString()
    });
  }

  // Get winning proposal
  const winningProposal = await publicClient.readContract({
    address: contractAddress as Address,
    abi,
    functionName: 'winningProposal',
  }) as bigint;

  const winnerName = await publicClient.readContract({
    address: contractAddress as Address,
    abi,
    functionName: 'winnerName',
  }) as string;

  console.log('\nCurrent winning proposal:', {
    index: winningProposal.toString(),
    name: winnerName
  });

  // Query all proposals
  let proposalIndex = 0;
  const proposals: any[] = [];
  
  while (true) {
    try {
      const proposal = await publicClient.readContract({
        address: contractAddress as Address,
        abi,
        functionName: 'proposals',
        args: [BigInt(proposalIndex)],
      }) as [string, bigint];

      proposals.push({
        index: proposalIndex,
        name: proposal[0],
        voteCount: proposal[1].toString()
      });
      
      proposalIndex++;
    } catch (error) {
      // Break the loop at end of proposals
      break;
    }
  }

  console.log('\nAll proposals:');
  proposals.forEach(proposal => {
    console.log(`Proposal ${proposal.index}: "${proposal.name}" with ${proposal.voteCount} votes`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
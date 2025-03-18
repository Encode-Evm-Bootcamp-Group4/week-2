# Ballot Contract Deployment and Scripts Report

## Initial Deployment

npx ts-node --files ./scripts/DeployWithViem.ts "Proposal 1" "Proposal 2" "Proposal 3"

**Results:**

- Last block: 7921899n
- Deployer: 0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30
- Deployer balance: 0.444958996153831951 ETH
- Contract address: 0x8481cff6926669af2964d6fa8c078793bb4c5d05
- Transaction hash: 0x64339df868e420943e1191f75e8acdffa50ac836e50da6908ed9cae8b26e243f

## Available Scripts

1. Give voting rights:

```bash
npx ts-node scripts/GiveVotingRights.ts <address>
```

2. Cast vote:

```bash
npx ts-node scripts/CastVote.ts <proposal_number>
```

3. Delegate votes:

```bash
npx ts-node scripts/DelegateVotes.ts <address>
```

4. Query voter status:

```bash
npx ts-node scripts/QueryVote.ts <voter_address>
```

## Transaction Results

### Give Voting Rights

**Command executed:**

```bash
npx ts-node scripts/GiveVotingRights.ts 0x4be7F17291d3194b33edE62D177B5294234d8AA2
```

**Details:**

- Deployer/Chairperson: 0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30
- Target address: 0x4be7F17291d3194b33edE62D177B5294234d8AA2
- Contract address: 0x8481cff6926669af2964d6fa8c078793bb4c5d05
- Transaction hash: 0x08c609a8f12af055c9822b4124489779c15c2bb6cbfab8b262b0ca1e3f1ab5fa
- Confirmed in block: 7922028n

**Initial voter status:**

```json
{
  "weight": "0",
  "voted": false,
  "delegate": "0x0000000000000000000000000000000000000000",
  "vote": "0"
}
```

### Cast Vote

**Command executed:**

```bash
npx ts-node scripts/CastVote.ts 1
```

**Initial voter status:**

```json
{
  "address": "0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30",
  "weight": "1",
  "voted": false,
  "delegate": "0x0000000000000000000000000000000000000000",
  "vote": "0"
}
```

**Transaction details:**

- Contract address: 0x8481cff6926669af2964d6fa8c078793bb4c5d05
- Transaction hash: 0xd9b2ca261427c3cba61eafe38add6080236b67b425a7c906c7a2930b558c5d82
- Confirmed in block: 7921914n

### Delegate Vote

**Command executed:**

```bash
npx ts-node scripts/CastVote.ts "0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30"
```

**Initial Delegator/Delegate status:**

```json
{
  "Delegator status": {
    "address": "0x4be7F17291d3194b33edE62D177B5294234d8AA2",
    "weight": "1",
    "voted": false,
    "delegate": "0x0000000000000000000000000000000000000000",
    "vote": "0"
  },
  "Delegate status": {
    "address": "0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30",
    "weight": "1",
    "voted": true,
    "delegate": "0x0000000000000000000000000000000000000000",
    "vote": "1"
  }
}
```

**Transaction details:**

- Contract address: 0x8481cff6926669af2964d6fa8c078793bb4c5d05
- Transaction hash: 0xe844d332204a67c0d7b374d5d8c5539e13f5ef39237f1f5d4dfdb547b5ced3da
- Confirmed in block: 7925006n

**Final Delegator status:**

```json
{
  "delegator status": {
    "address": "0x4be7F17291d3194b33edE62D177B5294234d8AA2",
    "weight": "1",
    "voted": true,
    "delegate": "0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30",
    "vote": "0"
  }
}
```

### Query Vote

**Chairperson:** 0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30

**Final voter status:**

```json
{
  "address": "0xcE292cB616aE5FcAB4Ea6fcbc7354a748dC00b30",
  "weight": "1",
  "voted": true,
  "delegate": "0x0000000000000000000000000000000000000000",
  "vote": "1"
}
```

**Current winning proposal:**

```json
{
  "index": "1",
  "name": "0x50726f706f73616c203200000000000000000000000000000000000000000000"
}
```

**All proposals status:**

- Proposal 0: "0x50726f706f73616c203100000000000000000000000000000000000000000000" (0 votes)
- Proposal 1: "0x50726f706f73616c203200000000000000000000000000000000000000000000" (1 vote)
- Proposal 2: "0x50726f706f73616c203300000000000000000000000000000000000000000000" (0 votes)

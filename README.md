# CrowdGenesis — Decentralized Crowdfunding Platform

A complete blockchain crowdfunding application featuring Solidity smart contracts and a premium React frontend.

## ✨ Features
- **Campaign Creation**: Launch decentralized crowdfunding campaigns with clear goals and deadlines.
- **Micro-donations**: Support projects directly with ETH.
- **Smart Fund Claiming**: Funds can only be claimed by the creator if the goal is met and the deadline has passed.
- **Real-time Stats**: Track raised amounts, donor lists, and days remaining.
- **Modern UI**: Sleek dark-mode aesthetic with responsive design.

---

## 🛠️ Tech Stack
- **Blockchain**: Solidity, Ethereum Sepolia Testnet
- **Developer Tools**: Hardhat, Ethers.js v6
- **Frontend**: React.js (Vite), Tailwind CSS
- **Wallet**: MetaMask

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: [Download here](https://nodejs.org/)
- **MetaMask**: Install the [MetaMask Extension](https://metamask.io/)
- **Sepolia ETH**: Get free test tokens from the [Alchemy Faucet](https://sepoliafaucet.com/) or [Infura Faucet](https://www.infurafaucet.com/sepolia).

---

### 2. Smart Contract Deployment

1. Navigate to the blockchain directory:
   ```bash
   cd blockchain
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`.
   - Add your `SEPOLIA_RPC_URL` (from Alchemy/Infura) and `PRIVATE_KEY` (from MetaMask).
4. Compile the contract:
   ```bash
   npx hardhat compile
   ```
5. Deploy to Sepolia:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
6. **Note**: After deployment, copy the contract address and the ABI from `artifacts/contracts/CrowdFunding.sol/CrowdFunding.json`.

---

### 3. Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update Contract Details:
   - Open `src/constants/index.js`.
   - Update `CONTRACT_ADDRESS` with your deployed address.
   - Update `ABI` if you made any changes to the contract.
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🏗️ Folder Structure

- `blockchain/`: Hardhat environment and Solidity contracts.
- `client/`: React/Vite frontend.
  - `src/context/`: Web3 logic using Ethers.js v6.
  - `src/pages/`: Main application views.
  - `src/components/`: Reusable UI elements.

---

## 🧪 Testing

To run smart contract tests:
```bash
cd blockchain
npx hardhat test
```

---

## 📜 License
Unlicense. Feel free to use this for your college projects or learning!

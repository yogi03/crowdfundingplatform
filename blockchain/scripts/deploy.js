const hre = require("hardhat");

async function main() {
  console.log("Deploying CrowdFunding contract...");

  const CrowleyFunding = await hre.ethers.deployContract("CrowdFunding");

  await CrowleyFunding.waitForDeployment();

  console.log(`CrowdFunding deployed to: ${CrowleyFunding.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

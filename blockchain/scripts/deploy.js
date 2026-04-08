const hre = require("hardhat");

async function main() {
  console.log("Deploying CrowdFunding contract...");

  const CrowleyFunding = await hre.ethers.deployContract("CrowdFunding");

  await CrowleyFunding.waitForDeployment();

  const fs = require('fs');
  fs.writeFileSync('address.txt', CrowleyFunding.target);
  console.log(`CrowdFunding deployed to: ${CrowleyFunding.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const hre = require("hardhat");

async function main() {
  const TaskContract = await hre.ethers.getContractFactory("TaskContract");
  const taskContract = await TaskContract.deploy();

  const contractAddress = await taskContract.getAddress();
  console.log("TaskContract deployed to:", contractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

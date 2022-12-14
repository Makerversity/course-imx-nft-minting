import { ethers, hardhatArguments, run } from "hardhat";
import { getIMXAddress, getEnv, sleep } from "./utils";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying Contract with the account:", deployer.address);
    console.log("Account Balance:", (await deployer.getBalance()).toString());

    if (!hardhatArguments.network) {
        throw new Error("please pass --network");
    }

    const owner = getEnv("OWNER_ACCOUNT_ADDRESS");
    const name = getEnv("CONTRACT_NAME");
    const symbol = getEnv("CONTRACT_SYMBOL");
    const baseUri = getEnv("CONTRACT_METADATA_URI");

    const Asset = await ethers.getContractFactory("Asset");
    const imxAddress = getIMXAddress(hardhatArguments.network);
    const asset = await Asset.deploy(owner, name, symbol, baseUri, imxAddress);
    console.log("\n\nDeployed successfully!!");
    console.log("View on etherscan: https://goerli.etherscan.io/address/" + asset.address);
    console.log("\nUpdate the following in your .env file");
    console.log(`CONTRACT_ADDRESS=\"${asset.address}\"\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

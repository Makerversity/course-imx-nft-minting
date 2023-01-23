import { ethers, hardhatArguments, run } from "hardhat";
import { Asset } from "../artifacts/typechain";
import { getIMXAddress, getEnv, sleep } from "./utils";

const MAX_VERIFY_ATTEMPTS = 6
const MILISECONDS_BETWEEN_VERIFY_ATTEMPTS = 20000 //20 seconds

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
    console.log();
    console.log("Deployed successfully!!");
    console.log("View on etherscan: https://goerli.etherscan.io/address/" + asset.address);
    console.log();
    console.log(`Verifying the contract`);
    console.log(`(This may take a few minutes)`);
    await verifyContract(1, asset, owner, name, symbol, baseUri, imxAddress)
    console.log(`Contract verified`);
    console.log();
    console.log();
    console.log("Deployed successfully!!");
    console.log(
    "View on etherscan: https://goerli.etherscan.io/address/" + asset.address
    );
    console.log();
    console.log("Update the following in your .env file:");
    console.log(`CONTRACT_ADDRESS=${asset.address}`);
}

async function verifyContract(attempts: number, asset: Asset, owner: string, name: string, symbol: string, baseUri: string, imxAddress: string) {

    await sleep(MILISECONDS_BETWEEN_VERIFY_ATTEMPTS)

    try {
        await run("verify:verify", {
            address: asset.address,
            constructorArguments: [owner, name, symbol, baseUri, imxAddress],
        });
    } catch (e) {
        let alreadyVerified = false;
        if (e.message) {
            alreadyVerified = e.message.includes("Already Verified")
        }
        if (attempts < MAX_VERIFY_ATTEMPTS && !alreadyVerified) {
            await verifyContract((attempts + 1), asset, owner, name, symbol, baseUri, imxAddress)
        } else {
            if (!alreadyVerified) {
                console.error(e)
            }
        }
    }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

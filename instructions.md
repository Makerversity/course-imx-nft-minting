# Overview

This document will get you up and running with a ERC-721 asset contract on IMX. It's broken down into 3 key steps.
1. Deploy your smart contract to Ethereum
2. Configure your smart contract on IMX
3. Mint your tokens on IMX

# Deploy your smart contract

1. Install the dependancies 
```sh
npm install
``` 

2. Make a copy of the `.env.example` file and rename the file to `.env`.
```sh
cp .env.example .env
```

3. Generate a new `address` and `private key`
```sh
npm run generate-random-key
```
Add them to the `.env`
- `CONTRACT_OWNER_ADDRESS`
- `OWNER_ACCOUNT_PRIVATE_KEY`

4. Go to Alchemy and Etherscan and copy your API keys to the `.env` file.
- `ETHERSCAN_API_KEY`
    - which can be obtained from [your Etherscan account.](https://etherscan.io/myapikey)
- `ALCHEMY_API_KEY`
    - which you will need to make an account with [Alchemy.](https://www.alchemy.com/)

5. Add some Goerli Eth to your account using a faucet. You will need this to deploy the smart contract. [You can use this one](https://goerlifaucet.com/)

6. [Optional] Update the name and the symbol of the contract before you deploy. 

- `CONTRACT_NAME`
- `CONTRACT_SYMBOL`

7. Deploy your contract.
```sh
npx hardhat run deploy/asset.ts --network sandbox
```

8. Copy the `Deployed Contract Address` contract address and add it to the `.env`
- `COLLECTION_CONTRACT_ADDRESS`

# Setup your Smart contract in IMX

## 1. Register as a user with Immutable X

ImmutableX provide an authentication service to protect your administrative level assets from being accessed or updated by someone else. This is done using a simliar technique as described [here](https://link.medium.com/CVTcj7YfQkb).

In order to use services like creating a project or collection, you will first need to register as an ImmutableX user. This is done by setting up an account using the private key from the wallet account you would like to specify as the owner of the project.

Run the following script:

```sh
npm run onboarding:user-registration
```

## 2. Create project

Update the values in file `2-create-project.ts` with the values of the project you want to create.

- `name` - _The name of the project_
- `company_name` - _The name of the company_
- `contact_email` - _Your associated company email_

Once updated, run the following script to create your project:

```sh
npm run onboarding:create-project
```

On completion, the script will log the ID of the created project. Save this ID for use in the next step.

## 3. Add a collection

A collection refers to the smart contract that you have deployed. Minted assets belong to a collection. In order to mint assets on L2
you must first register your collection (smart contract) with ImmutableX.

Set `COLLECTION_PROJECT_ID` to the project ID you created with `create-project` step

Once updated, run the following script to create your collection:

_Requires environment variables `OWNER_ACCOUNT_PRIVATE_KEY`, `COLLECTION_PROJECT_ID` and `COLLECTION_CONTRACT_ADDRESS` to be set._

```sh
npm run onboarding:create-collection
```
If you see a `replacement transaction underpriced` error message when trying to run `create-collection` please try again in 5 minutes.

# Minting assets

Set the `TOKEN_ID` in the `.env` to the latest incremented index.

To mint:

```sh
npm run mint -- -w <TO_WALLET_ADDRESS>
```

**-w** - _the wallet you wish to mint your NFTs to_

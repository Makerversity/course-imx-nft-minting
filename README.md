# Overview

This document will get you up and running with a ERC-721 asset contract on IMX. It's broken down into 3 key steps.
1. Deploy your smart contract to Ethereum
2. Configure your smart contract on IMX
3. Mint your tokens on IMX

# Deploy your smart contract

## 1. Install the dependancies 
```sh
npm install
``` 

## 2. Copy env file
Make a copy of the `.env.example` file and rename the file to `.env`.
```sh
cp .env.example .env
```
## 3. Generate new address
Generate a new `address` and `private key`
```sh
npm run generate-random-key
```
Add them to the `.env`
- `CONTRACT_OWNER_ADDRESS`
- `OWNER_ACCOUNT_PRIVATE_KEY`

## 4. Setup provider API keys
Go to Alchemy and Etherscan and copy your API keys to the `.env` file.
- `ETHERSCAN_API_KEY`
    - which can be obtained from [your Etherscan account.](https://etherscan.io/myapikey)
- `ALCHEMY_API_KEY`
    - which you will need to make an account with [Alchemy.](https://dashboard.alchemy.com/)

## 5. Get some Goerli Eth
Add some Goerli Eth to your account using a faucet. You will need this to deploy the smart contract. [You can use this one](https://goerlifaucet.com/)

## 6. Update contract details
[Optional] Update the name and the symbol of the contract in the `.env` file before you deploy. 

- `CONTRACT_NAME`
- `CONTRACT_SYMBOL`

## 7. Deploy the contract

```sh
npm run simple-deploy-sandbox
```

## 8. Update env with contract address
Copy the `Deployed Contract Address` contract address from the console and add it to the `.env`
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

Set `PROJECT_ID` to the project ID you created with `create-project` step

Once updated, run the following script to create your collection:

_Requires environment variables `OWNER_ACCOUNT_PRIVATE_KEY`, `PROJECT_ID` and `COLLECTION_CONTRACT_ADDRESS` to be set._

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

---




# Immutable X Contracts

## Installation: 

```
npm install @imtbl/imx-contracts
``` 

or 

```
yarn add @imtbl/imx-contracts
```

## Immutable Contract Addresses

| Environment/Network       | Core (StarkEx Bridge) Contract                                                                                                | User Registration Contract                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Sandbox (Goerli)**      | [0x7917edb51ecd6cdb3f9854c3cc593f33de10c623](https://goerli.etherscan.io/address/0x7917eDb51ecD6CdB3F9854c3cc593F33de10c623)  | [0x1c97ada273c9a52253f463042f29117090cd7d83](https://goerli.etherscan.io/address/0x1C97Ada273C9A52253f463042f29117090Cd7D83)  |
| **Production (Mainnet)**  | [0x5fdcca53617f4d2b9134b29090c87d01058e27e9](https://etherscan.io/address/0x5FDCCA53617f4d2b9134B29090C87D01058e27e9)         | [0x72a06bf2a1CE5e39cBA06c0CAb824960B587d64c](https://etherscan.io/address/0x72a06bf2a1CE5e39cBA06c0CAb824960B587d64c)         |

## Setup

You will need an Ethereum wallet private key to deploy contracts. This can be your own private key or you can use the `scripts/generateRandomKey.ts` script to generate a new random Ethereum private key and address for use with this repo with the following command:

```sh
yarn generate-random-key
```

Also required are API keys for [Alchemy](https://www.alchemy.com/) and [Etherscan](https://etherscan.io/) to deploy contracts from this repo.

1. Make a copy of the `.env.example` file and rename the file to `.env`.
2. Add private keys and API keys to the `.env` file.

**Note:** All the environment variables in `.env` need a value or hardhat will throw an error.

# L2 Minting

Immutable X is the only NFT scaling protocol that supports minting assets on L2, and having those assets be trustlessly withdrawable to Ethereum L1. To enable this, before you can mint on L2, you need to deploy an IMX-compatible ERC721 contract as the potential L1 home for these assets. Luckily, making an ERC721 contract IMX-compatible is easy!

### No Code Usage (Test Environment Only)

In the test environment, deploying an ERC721 contract which is compatible with Immutable X is extremely easy. First, update the `.env` file, setting:

- `CONTRACT_OWNER_ADDRESS`
- `CONTRACT_NAME`
- `CONTRACT_SYMBOL`
- `ETHERSCAN_API_KEY`
  - which can be obtained from [your Etherscan account.](https://etherscan.io/myapikey)

Then, just run `yarn hardhat run deploy/asset.ts --network sandbox`.

### Basic Usage

If you're starting from scratch, simply deploy a new instance of `Asset.sol` and you'll have an L2-mintable ERC721 contract. Set the `_imx` parameter in the contract constructor to either the `Sandbox` or `Production` addresses as above.

If you already have an ERC721 contract written, simply add `Mintable.sol` as an ancestor, implement the `_mintFor` function with your internal mint function, and set up the constructor as above:

```
import "@imtbl/imx-contracts/contracts/Mintable.sol";

contract YourContract is Mintable {

    constructor(address _imx) Mintable(_imx) {}

    function _mintFor(
        address to,
        uint256 id,
        bytes calldata blueprint
    ) internal override {
        // TODO: mint the token using your existing implementation
    }

}
```

### Advanced Usage

To enable L2 minting, your contract must implement the `IMintable.sol` interface with a function which mints the corresponding L1 NFT. This function is `mintFor(address to, uint256 quantity, bytes mintingBlob)`. Note that this is a different function signature to `_mintFor` in the previous example. The "blueprint" is the immutable metadata set by the minting application at the time of asset creation. This blueprint can store the IPFS hash of the asset, or some of the asset's properties, or anything a minting application deems valuable. You can use a custom implementation of the `mintFor` function to do whatever you like with the blueprint.

Your contract also needs to have an `owner()` function which returns an `address`. You must be able to sign a message with this address, which is used to link this contract your off-chain application (so you can authorise L2 mints). A simple way to do this is using the OpenZeppelin `Ownable` contract (`npm install @openzeppelin/contracts`).

```
import "@imtbl/imx-contracts/contracts/Mintable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YourContract is IMintable, Ownable {

    function mintFor(
        address to,
        uint256 quantity,
        bytes calldata mintingBlob
    ) external override {
        // TODO: make sure only Immutable X can call this function
        // TODO: mint the token!
    }

}
```

`Registration.sol` & `IMX.sol` is for reference purposes if you choose to offer these functions in your own smart contracts and is not required if you only want to deploy an ERC721.


### Manually verifying registration contract

First, deploy to sandbox as described in the [L2 Minting](#l2-minting) section. Change to mainnet if required.

Verification with Etherscan should happen automatically within a few minutes of contract deployment, but if it fails you can run it manually, e.g.

```
yarn hardhat verify --network <network> <address> <args used in deployment>
```

### Generating Typescript Types

Run `yarn compile`. The output can be found in the `artifacts/typechain` folder.

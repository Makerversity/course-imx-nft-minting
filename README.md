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
```sh
cp .env.example .env
```
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

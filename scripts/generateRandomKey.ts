import Wallet from 'ethereumjs-wallet';

console.log('Generating a new Ethereum wallet with a random private key...')

const wallet = Wallet.generate();

console.log(`
Update the following values in the .env file:

OWNER_ACCOUNT_ADDRESS=${wallet.getAddressString()}
OWNER_ACCOUNT_PRIVATE_KEY=${wallet.getPrivateKeyString()}
`);

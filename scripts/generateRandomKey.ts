import Wallet from 'ethereumjs-wallet';

const wallet = Wallet.generate();

console.log(`
  Update the following values in the .env file

  OWNER_ACCOUNT_ADDRESS="${wallet.getAddressString()}"
  OWNER_ACCOUNT_PRIVATE_KEY="${wallet.getPrivateKeyString()}"
`);

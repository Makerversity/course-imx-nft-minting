import Wallet from 'ethereumjs-wallet';

const wallet = Wallet.generate();

console.log(`
  [ MAKE SURE TO SECURELY STORE THE PRIVATE KEY!! ]

  Private Key:  ${wallet.getPrivateKeyString()}
  Address:      ${wallet.getAddressString()}
`);

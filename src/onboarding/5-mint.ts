import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { ImmutableXClient, ImmutableMethodParams } from '@imtbl/imx-sdk';
import { parse } from 'ts-command-line-args';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

interface BulkMintScriptArgs {
  wallet: string;
}

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);
const component = 'imx-mint-script';

(async (): Promise<void> => {
  const { wallet } = parse<BulkMintScriptArgs>({
    wallet: {
      type: String,
      alias: 'w',
      description: 'Wallet to receive minted NFTs',
    }
  });

  const tokenId = parseInt(env.tokenId, 10);
  console.log('tokenId');
  console.log(tokenId);

  const minter = await ImmutableXClient.build({
    ...env.client,
    signer: new Wallet(env.ownerAccountPrivateKey).connect(provider),
  });

  const token = {
    id: (tokenId).toString(),
    blueprint: 'onchain-metadata',
  }

  const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
    {
      contractAddress: env.collectionContractAddress,
      users: [
        {
          etherKey: wallet.toLowerCase(),
          tokens: [token],
        },
      ],
    },
  ];

  const result = await minter.mintV2(payload);
  console.log(result);

  console.log(`You can view your NFT at https://market.sandbox.immutable.com/inventory/assets/${env.collectionContractAddress}/${tokenId}.`)
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});

import { AlchemyProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import { ImLogger, WinstonLogger } from '@imtbl/imlogging';
import { CreateCollectionParams, ImmutableXClient } from '@imtbl/imx-sdk';
import { getEnv, requireEnvironmentVariable } from 'libs/utils';

import env from '../config/client';
import { loggerConfig } from '../config/logging';

const provider = new AlchemyProvider(env.ethNetwork, env.alchemyApiKey);
const log: ImLogger = new WinstonLogger(loggerConfig);

const component = '[IMX-CREATE-COLLECTION]';

(async (): Promise<void> => {
  const privateKey = requireEnvironmentVariable('OWNER_ACCOUNT_PRIVATE_KEY');
  const collectionContractAddress = requireEnvironmentVariable(
    'CONTRACT_ADDRESS',
  );
  const projectId = requireEnvironmentVariable('PROJECT_ID');

  const wallet = new Wallet(privateKey);
  const signer = wallet.connect(provider);
  const ownerPublicKey = wallet.publicKey;

  console.log('wallet.publicKey', wallet.publicKey)

  const user = await ImmutableXClient.build({
    ...env.client,
    signer,
    enableDebug: true,
  });

  log.info(component, 'Creating collection...', collectionContractAddress);

  const params: CreateCollectionParams = {
    name: getEnv('COLLECTION_NAME'),
    description: getEnv('COLLECTION_DESCRIPTION'),
    icon_url: getEnv('COLLECTION_ICON_URL'),
    collection_image_url: getEnv('COLLECTION_IMAGE_URL'),
    contract_address: collectionContractAddress,
    owner_public_key: ownerPublicKey,
    metadata_api_url: getEnv('CONTRACT_METADATA_URI'),
    project_id: parseInt(projectId, 10),
  };

  let collection;
  try {
    collection = await user.createCollection(params);
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }

  log.info(component, 'Created collection\n');
  console.log(JSON.stringify(collection, null, 2));
})().catch(e => {
  log.error(component, e);
  process.exit(1);
});

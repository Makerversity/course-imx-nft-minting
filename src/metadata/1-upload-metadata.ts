import { NFTStorage, File, Blob } from "nft.storage";
import fs from "fs";
import { requireEnvironmentVariable } from "libs/utils";

const NFT_STORAGE_TOKEN = requireEnvironmentVariable('NFT_STORAGE_TOKEN');

const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

(async function storeDirectoryFs() {

  const images = []
  for (let i = 1; i <= 5; i++) {
      const filename = i + ".png"
      images.push(new File([await fs.promises.readFile(`./src/metadata/images/${filename}`)], filename, {type: "image/png"} ))
  }

  const imagesCid = await uploadFiles(images)

  const metadata = []
  for (let i = 1; i <= 5; i++) {
      const filename = i
      const rawJson = await fs.promises.readFile(`./src/metadata/data/${filename}`)
      const parsedJson = JSON.parse(rawJson.toString())

      parsedJson["image_url"] = `https://nftstorage.link/ipfs/${imagesCid}/${i}.png`
      metadata.push(new File([JSON.stringify(parsedJson)], i.toString(), {type: "application/json"} ))
  }

  await uploadFiles(metadata)
})()

async function uploadFiles(files: File[]) {
  console.log("The following files will be uploaded")
  console.log(files)
  const cid = await client.storeDirectory(files)
  console.log("Successfully uploaded!!")
  console.log(`CID: ${cid}`)
  console.log(`IPFS URL: ipfs://${cid}`)
  console.log(`Gateway URL: https://nftstorage.link/ipfs/${cid}`)
  console.log("")
  console.log("")
  return cid
}

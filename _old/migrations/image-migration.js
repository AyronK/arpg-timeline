import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";
import 'dotenv/config';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2023-01-01",
});

async function uploadImage(imagePath, filename) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const asset = await client.assets.upload("image", imageBuffer, {
      filename: filename,
    });
    return asset;
  } catch (error) {
    console.error(`Error uploading image ${filename}:`, error);
    return null;
  }
}

async function migrateImages() {
  console.log("Starting image migration...");

  // Read your ./static/img directory
  const imgDir = "./static/img";
  const imageFiles = fs
    .readdirSync(imgDir)
    .filter((file) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));

  for (const imageFile of imageFiles) {
    const imagePath = path.join(imgDir, imageFile);
    console.log(`Uploading ${imageFile}...`);

    const asset = await uploadImage(imagePath, imageFile);
    if (asset) {
      console.log(`✓ Uploaded: ${imageFile} -> ${asset._id}`);

      // Update documents that reference this image
      // You'll need to match the image filename to your game logos
      // This is a simplified example - adjust based on your data structure
      const query = `*[_type == "game" && slug.current == $slug][0]`;
      // Update logic here based on how you associate images with games
    }
  }

  console.log("✅ Image migration completed!");
}

migrateImages();

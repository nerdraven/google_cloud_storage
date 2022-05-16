import { Bucket, Storage } from "@google-cloud/storage";
import aguid from "aguid";
import axios from "axios";

process.env.NODE_DEBUG = "https";

export async function downloadImageFromUrl(url: string): Promise<Buffer> {
    const data = await axios.get(url, { responseType: "arraybuffer" });
    const res = Buffer.from(data.data, "binary");
    return res;
  }

export abstract class StorageBucket {
  abstract upload(data: Buffer): Promise<string>;
}

class GoogleCloudStorage implements StorageBucket {
  public static readonly client: Storage = new Storage({
    projectId: "<PROJECT_ID>",
  });
  private readonly bucket: Bucket;

  constructor(bucketName: string) {
    this.bucket = GoogleCloudStorage.client.bucket(bucketName);
  }

  public async upload(data: Buffer): Promise<string> {
    try {
      const name = aguid(Math.random().toString());
      const file = this.bucket.file(name);
      file.save(data);
      return file.publicUrl();
    } catch (error) {
      // TODO: Log to STDOUT that it failed
      console.error("Failed to upload");
      throw new Error("Failed to upload");
    }
  }
}

export default GoogleCloudStorage;

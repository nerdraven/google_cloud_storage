// import GoogleStorageBucket from "./image_upload";
import GoogleStorageBucket, { downloadImageFromUrl } from "./example";
import crypto from "crypto";

const imageUrl = "https://io.google/2021/assets/io_social_asset.jpg";
const expectedSha =
  "c027cff6db10ee8fed423b151d11dba92d903b912becea2ed64dabf34b3530b2";

describe("Test Download of image", () => {
  test("Image gets downloaded", async () => {
    expect.assertions(1);
    const bytes = await downloadImageFromUrl(imageUrl);
    const sha = crypto.createHash("sha256").update(bytes).digest("hex");

    expect(sha).toEqual(expectedSha);
  });
});

describe("Google Cloud Storage testsuite", () => {
  const bucketName = "evently-eventimageupload-dev-useast1";

  // beforeAll(async () => {
  //   GoogleStorageBucket.client.createBucket(bucketName);
  // });

  // afterAll(async () => {

  // });

  test("It should upload files to Cloud Storage", async () => {
    expect.assertions(1);
    // GoogleStorageBucket.client.createBucket(bucketName);
    const bucket = new GoogleStorageBucket(bucketName);

    const imageBytes = await downloadImageFromUrl(imageUrl);
    bucket.upload(imageBytes);

    const files = await GoogleStorageBucket.client
      .bucket(bucketName)
      .getFiles();

    expect(files.length).toBeGreaterThan(0);

    // GoogleStorageBucket.client.bucket(bucketName).delete({
    //   ignoreNotFound: true,
    // });
  });
});

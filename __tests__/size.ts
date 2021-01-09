import path from "path";

import Assets from "../src/index";

test("w/o options", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");

  await expect(asset.getDimensions()).resolves.toEqual({
    height: 114,
    width: 200,
  });
});

test("basePath + loadPaths", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const asset = await resolver.resolve("picture.png");

  await expect(asset.getDimensions()).resolves.toEqual({
    height: 57,
    width: 200,
  });
});

test("non-existing file", async () => {
  const resolver = new Assets();

  await expect(resolver.resolve("non-existing.gif")).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

test("nonsupported file type", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/fonts/empty-sans.woff"
  );

  await expect(asset.getDimensions()).rejects.toThrow(
    `File type not supported: ${path.resolve(
      "__tests__/fixtures/fonts/empty-sans.woff"
    )}`
  );
});

test("invalid file", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/invalid.jpg");

  await expect(asset.getDimensions()).rejects.toThrow(
    `Invalid JPEG file: ${path.resolve("__tests__/fixtures/invalid.jpg")}`
  );
});

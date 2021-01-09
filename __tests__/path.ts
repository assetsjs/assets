import path from "path";

import Assets from "../src/index";

test("w/o options", async () => {
  const instance = new Assets();
  const asset = await instance.resolve("__tests__/fixtures/duplicate-1.jpg");

  expect(asset.path).toBe(path.resolve("__tests__/fixtures/duplicate-1.jpg"));
});

test("basePath", async () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
  });
  const asset = await instance.resolve("duplicate-1.jpg");

  expect(asset.path).toBe(path.resolve("__tests__/fixtures/duplicate-1.jpg"));
});

test("loadPaths", async () => {
  const instance = new Assets({
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
  });
  const asset = await instance.resolve("picture.png");

  expect(asset.path).toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("loadPaths string", async () => {
  const instance = new Assets({
    loadPaths: "__tests__/fixtures/images",
  });
  const asset = await instance.resolve("picture.png");

  expect(asset.path).toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("loadPaths glob", async () => {
  const instance = new Assets({
    loadPaths: "__tests__/fixtures/*",
  });
  const asset = await instance.resolve("picture.png");

  expect(asset.path).toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("basePath + loadPaths", async () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const asset = await instance.resolve("picture.png");

  expect(asset.path).toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("absolute needle + basePath", async () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
  });
  const asset = await instance.resolve(
    path.resolve("__tests__/fixtures/duplicate-1.jpg")
  );

  expect(asset.path).toBe(path.resolve("__tests__/fixtures/duplicate-1.jpg"));
});

test("absolute basePath + loadPaths", async () => {
  const instance = new Assets({
    basePath: path.resolve("__tests__/fixtures"),
    loadPaths: [
      path.resolve("__tests__/fixtures/fonts"),
      path.resolve("__tests__/fixtures/images"),
    ],
  });
  const asset = await instance.resolve("picture.png");

  expect(asset.path).toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("non-existing file", async () => {
  const instance = new Assets();

  await expect(instance.resolve("non-existing.gif")).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

test("prioritize basePath over the loadPaths", async () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const asset = await instance.resolve("duplicate-1.jpg");

  expect(asset.path).toBe(path.resolve("__tests__/fixtures/duplicate-1.jpg"));
});

test("prioritize firsts loadPaths over the lasts", async () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const asset = await instance.resolve("duplicate-2.txt");

  expect(asset.path).toBe(
    path.resolve("__tests__/fixtures/fonts/duplicate-2.txt")
  );
});

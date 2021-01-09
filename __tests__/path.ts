import path from "path";

import Assets from "../src/index";

test("w/o options", () => {
  const instance = new Assets();
  const result = instance.path("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/duplicate-1.jpg")
  );
});

test("basePath", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
  });
  const result = instance.path("duplicate-1.jpg");

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/duplicate-1.jpg")
  );
});

test("loadPaths", () => {
  const instance = new Assets({
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
  });
  const result = instance.path("picture.png");

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("loadPaths string", () => {
  const instance = new Assets({
    loadPaths: "__tests__/fixtures/images",
  });
  const result = instance.path("picture.png");

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("loadPaths glob", () => {
  const instance = new Assets({
    loadPaths: "__tests__/fixtures/*",
  });
  const result = instance.path("picture.png");

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("basePath + loadPaths", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const result = instance.path("picture.png");

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("absolute needle + basePath", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
  });
  const result = instance.path(
    path.resolve("__tests__/fixtures/duplicate-1.jpg")
  );

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/duplicate-1.jpg")
  );
});

test("absolute basePath + loadPaths", () => {
  const instance = new Assets({
    basePath: path.resolve("__tests__/fixtures"),
    loadPaths: [
      path.resolve("__tests__/fixtures/fonts"),
      path.resolve("__tests__/fixtures/images"),
    ],
  });
  const result = instance.path("picture.png");

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/images/picture.png")
  );
});

test("non-existing file", () => {
  const instance = new Assets();
  const result = instance.path("non-existing.gif");

  return expect(result).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

test("prioritize basePath over the loadPaths", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const result = instance.path("duplicate-1.jpg");

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/duplicate-1.jpg")
  );
});

test("prioritize firsts loadPaths over the lasts", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const result = instance.path("duplicate-2.txt");

  return expect(result).resolves.toBe(
    path.resolve("__tests__/fixtures/fonts/duplicate-2.txt")
  );
});

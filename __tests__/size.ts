import path from "path";

import Assets from "../src/index";

test("w/o options", () => {
  const instance = new Assets();
  const result = instance.size("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toEqual({ height: 114, width: 200 });
});

test("basePath + loadPaths", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const result = instance.size("picture.png");

  return expect(result).resolves.toEqual({ height: 57, width: 200 });
});

test("non-existing file", () => {
  const instance = new Assets();
  const result = instance.size("non-existing.gif");

  return expect(result).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

test("nonsupported file type", () => {
  const instance = new Assets();
  const result = instance.size("__tests__/fixtures/fonts/empty-sans.woff");

  return expect(result).rejects.toThrow(
    `File type not supported: ${path.resolve(
      "__tests__/fixtures/fonts/empty-sans.woff"
    )}`
  );
});

test("invalid file", () => {
  const instance = new Assets();
  const result = instance.size("__tests__/fixtures/invalid.jpg");

  return expect(result).rejects.toThrow(
    `Invalid JPEG file: ${path.resolve("__tests__/fixtures/invalid.jpg")}`
  );
});

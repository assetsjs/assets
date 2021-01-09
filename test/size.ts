import path from "path";
import test from "ava";

import Assets from "../src/index";

test("w/o options", (t) => {
  const instance = new Assets();

  return instance.size("test/fixtures/duplicate-1.jpg").then((size) => {
    t.deepEqual(size, { width: 200, height: 114 });
  });
});

test("basePath + loadPaths", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  return instance.size("picture.png").then((size) => {
    t.deepEqual(size, { width: 200, height: 57 });
  });
});

test("non-existing file", (t) => {
  const instance = new Assets();

  return instance.size("non-existing.gif").then(
    () => t.fail(),
    (err: Error) => {
      t.true(err instanceof Error);
      t.is(err.message, "Asset not found or unreadable: non-existing.gif");
    }
  );
});

test("nonsupported file type", (t) => {
  const instance = new Assets();

  return instance.size("test/fixtures/fonts/empty-sans.woff").then(
    () => t.fail(),
    (err: Error) => {
      const absolutePath = path.resolve("test/fixtures/fonts/empty-sans.woff");
      t.true(err instanceof Error);
      t.is(err.message, `File type not supported: ${absolutePath}`);
    }
  );
});

test("invalid file", (t) => {
  const instance = new Assets();

  return instance.size("test/fixtures/invalid.jpg").then(
    () => t.fail(),
    (err: Error) => {
      const absolutePath = path.resolve("test/fixtures/invalid.jpg");
      t.true(err instanceof Error);
      t.is(err.message, `Invalid JPEG file: ${absolutePath}`);
    }
  );
});

import path from "path";
import test from "ava";

import Assets from "../src/index";

test("w/o options", (t) => {
  const instance = new Assets();

  return instance.path("test/fixtures/duplicate-1.jpg").then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
  });
});

test("basePath", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
  });

  return instance.path("duplicate-1.jpg").then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
  });
});

test("loadPaths", (t) => {
  const instance = new Assets({
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });

  return instance.path("picture.png").then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
  });
});

test("loadPaths string", (t) => {
  const instance = new Assets({
    loadPaths: "test/fixtures/images",
  });

  return instance.path("picture.png").then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
  });
});

test("loadPaths glob", (t) => {
  const instance = new Assets({
    loadPaths: "test/fixtures/*",
  });

  return instance.path("picture.png").then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
  });
});

test("basePath + loadPaths", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  return instance.path("picture.png").then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
  });
});

test("absolute needle + basePath", (t) => {
  const absoluteTo = path.resolve("test/fixtures/duplicate-1.jpg");

  const instance = new Assets({
    basePath: "test/fixtures",
  });

  return instance.path(absoluteTo).then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
  }, t.fail);
});

test("absolute basePath + loadPaths", (t) => {
  const instance = new Assets({
    basePath: path.resolve("test/fixtures"),
    loadPaths: [
      path.resolve("test/fixtures/fonts"),
      path.resolve("test/fixtures/images"),
    ],
  });

  return instance.path("picture.png").then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/images/picture.png"));
  });
});

test("non-existing file", (t) => {
  const instance = new Assets();

  return instance.path("non-existing.gif").then(t.fail, (err) => {
    t.true(err instanceof Error);
    t.is(err.message, "Asset not found or unreadable: non-existing.gif");
  });
});

test("prioritize basePath over the loadPaths", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  return instance.path("duplicate-1.jpg").then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/duplicate-1.jpg"));
  });
});

test("prioritize firsts loadPaths over the lasts", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  return instance.path("duplicate-2.txt").then((resolvedPath) => {
    t.is(resolvedPath, path.resolve("test/fixtures/fonts/duplicate-2.txt"));
  });
});

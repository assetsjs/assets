import fs from "fs";
import path from "path";

import Assets from "../src/index";

let statSyncStub: jest.SpyInstance;

beforeEach(() => {
  statSyncStub = jest.spyOn(fs, "statSync").mockReturnValue({
    mtime: new Date(Date.UTC(1991, 7, 24)),
  } as fs.Stats);
});

afterEach(() => {
  statSyncStub.mockRestore();
});

test("w/o options", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");
  const result = asset.toURL();

  expect(result).toBe("/__tests__/fixtures/duplicate-1.jpg");
});

test("basePath", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
  });
  const asset = await resolver.resolve("duplicate-1.jpg");
  const result = asset.toURL();

  expect(result).toBe("/duplicate-1.jpg");
});

test("baseURL", async () => {
  const resolver = new Assets({
    baseURL: "http://example.com/wp-content/themes",
  });
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");
  const result = asset.toURL();

  expect(result).toBe(
    "http://example.com/wp-content/themes/__tests__/fixtures/duplicate-1.jpg"
  );
});

test("loadPaths", async () => {
  const resolver = new Assets({
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
  });
  const asset = await resolver.resolve("picture.png");
  const result = asset.toURL();

  expect(result).toBe("/__tests__/fixtures/images/picture.png");
});

test("relativeTo", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/images/picture.png");
  const result = asset.toURL({
    relativeTo: "__tests__/fixtures/fonts",
  });

  expect(result).toBe("../images/picture.png");
});

test("basePath + baseURL", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
    baseURL: "http://example.com/wp-content/themes",
  });
  const asset = await resolver.resolve("duplicate-1.jpg");
  const result = asset.toURL();

  expect(result).toBe("http://example.com/wp-content/themes/duplicate-1.jpg");
});

test("basePath + loadPaths", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const asset = await resolver.resolve("picture.png");
  const result = asset.toURL();

  expect(result).toBe("/images/picture.png");
});

test("basePath + relativeTo", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
  });
  const asset = await resolver.resolve("images/picture.png");
  const result = asset.toURL({
    relativeTo: "fonts",
  });

  expect(result).toBe("../images/picture.png");
});

test("baseURL + loadPaths", async () => {
  const resolver = new Assets({
    baseURL: "http://example.com/wp-content/themes",
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
  });
  const asset = await resolver.resolve("picture.png");
  const result = asset.toURL();

  expect(result).toBe(
    "http://example.com/wp-content/themes/__tests__/fixtures/images/picture.png"
  );
});

test("baseURL + relativeTo", async () => {
  const resolver = new Assets({
    baseURL: "http://example.com/wp-content/themes",
  });
  const asset = await resolver.resolve("__tests__/fixtures/images/picture.png");
  const result = asset.toURL({
    relativeTo: "__tests__/fixtures/fonts",
  });

  expect(result).toBe("../images/picture.png");
});

test("loadPaths + relativeTo", async () => {
  const resolver = new Assets({
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
  });
  const asset = await resolver.resolve("picture.png");
  const result = asset.toURL({
    relativeTo: "__tests__/fixtures/fonts",
  });

  expect(result).toBe("../images/picture.png");
});

test("basePath + baseURL + loadPaths", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
    baseURL: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
  });
  const asset = await resolver.resolve("picture.png");
  const result = asset.toURL();

  expect(result).toBe(
    "http://example.com/wp-content/themes/images/picture.png"
  );
});

test("basePath + baseURL + relativeTo", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
    baseURL: "http://example.com/wp-content/themes",
  });
  const asset = await resolver.resolve("images/picture.png");
  const result = asset.toURL({
    relativeTo: "fonts",
  });

  expect(result).toBe("../images/picture.png");
});

test("basePath + loadPaths + relativeTo", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const asset = await resolver.resolve("picture.png");
  const result = asset.toURL({
    relativeTo: "fonts",
  });

  expect(result).toBe("../images/picture.png");
});

test("baseURL + loadPaths + relativeTo", async () => {
  const resolver = new Assets({
    baseURL: "http://example.com/wp-content/themes",
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
  });
  const asset = await resolver.resolve("picture.png");
  const result = asset.toURL({
    relativeTo: "__tests__/fixtures/fonts",
  });

  expect(result).toBe("../images/picture.png");
});

test("basePath + baseURL + loadPaths + relativeTo", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
    baseURL: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
  });
  const asset = await resolver.resolve("picture.png");
  const result = asset.toURL({
    relativeTo: "fonts",
  });

  expect(result).toBe("../images/picture.png");
});

test("absolute basePath + relativeTo", async () => {
  const resolver = new Assets({
    basePath: path.resolve("__tests__/fixtures"),
  });
  const asset = await resolver.resolve("images/picture.png");
  const result = asset.toURL({
    relativeTo: path.resolve("__tests__/fixtures/fonts"),
  });

  expect(result).toBe("../images/picture.png");
});

test("non-existing file", async () => {
  const resolver = new Assets();

  await expect(resolver.resolve("non-existing.gif")).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

test("baseURL w/ trailing slash", async () => {
  const resolver = new Assets({
    baseURL: "http://example.com/wp-content/themes/",
  });
  const asset = await resolver.resolve("__tests__/fixtures/images/picture.png");
  const result = asset.toURL();

  expect(result).toBe(
    "http://example.com/wp-content/themes/__tests__/fixtures/images/picture.png"
  );
});

test("default cachebuster", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");
  const result = asset.toURL({
    cachebuster: true,
  });

  expect(result).toBe("/__tests__/fixtures/duplicate-1.jpg?9f057edc00");
});

test("custom cachebuster w/ falsy result", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");
  const result = asset.toURL({
    cachebuster: () => {},
  });

  expect(result).toBe("/__tests__/fixtures/duplicate-1.jpg");
});

test("custom cachebuster w/ string result", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");
  const result = asset.toURL({
    cachebuster: () => "bust",
  });

  expect(result).toBe("/__tests__/fixtures/duplicate-1.jpg?bust");
});

test("custom cachebuster w/ number result", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");
  const result = asset.toURL({
    cachebuster: () => 42,
  });

  expect(result).toBe("/__tests__/fixtures/duplicate-1.jpg?42");
});

test("custom cachebuster w/ pathname", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");
  const result = asset.toURL({
    cachebuster: () => ({
      // TODO: Leading slash
      pathname: "/foo.png",
    }),
  });

  expect(result).toBe("/foo.png");
});

test("custom cachebuster w/ search", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");
  const result = asset.toURL({
    cachebuster: () => ({
      search: "bust",
    }),
  });

  expect(result).toBe("/__tests__/fixtures/duplicate-1.jpg?bust");
});

test("custom cachebuster w/ pathname + search", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");
  const result = asset.toURL({
    cachebuster: () => ({
      // TODO: Leading slash
      pathname: "/foo.png",
      search: "bust",
    }),
  });

  expect(result).toBe("/foo.png?bust");
});

test("custom cachebuster arguments", async () => {
  const cachebuster = jest.fn();
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
  });
  const asset = await resolver.resolve("duplicate-1.jpg");

  asset.toURL({ cachebuster });

  expect(cachebuster).toHaveBeenCalledWith(
    path.resolve("__tests__/fixtures/duplicate-1.jpg"),
    "/duplicate-1.jpg"
  );
});

test("search + hash", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
  const result = asset.toURL();

  expect(result).toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
});

test("search + hash w/ default cachebuster", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
  const result = asset.toURL({
    cachebuster: true,
  });

  expect(result).toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz&9f057edc00#hash"
  );
});

test("search + hash w/ custom cachebuster w/ falsy result", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
  const result = asset.toURL({
    cachebuster: () => {},
  });

  expect(result).toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
});

test("search + hash w/ custom cachebuster w/ string result", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
  const result = asset.toURL({
    cachebuster: () => "bust",
  });

  expect(result).toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz&bust#hash"
  );
});

test("search + hash w/ custom cachebuster w/ pathname", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
  const result = asset.toURL({
    cachebuster: () => ({
      // TODO: Leading slash
      pathname: "/foo.png",
    }),
  });

  expect(result).toBe("/foo.png?foo=bar&baz#hash");
});

test("search + hash w/ custom cachebuster w/ search", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
  const result = asset.toURL({
    cachebuster: () => ({
      search: "bust",
    }),
  });

  expect(result).toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz&bust#hash"
  );
});

test("search + hash w/ custom cachebuster w/ pathname + search", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
  const result = asset.toURL({
    cachebuster: () => ({
      // TODO: Leading slash
      pathname: "/foo.png",
      search: "bust",
    }),
  });

  expect(result).toBe("/foo.png?foo=bar&baz&bust#hash");
});

test("search + hash w/ relativeTo", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
  const result = asset.toURL({
    relativeTo: "__tests__/fixtures/fonts",
  });

  expect(result).toBe("../images/picture.png?foo=bar&baz#hash");
});

test("URI-encoded needle", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/white%20space.txt");
  const result = asset.toURL();

  expect(result).toBe("/__tests__/fixtures/white%20space.txt");
});

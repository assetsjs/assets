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

test("w/o options", () => {
  const instance = new Assets();
  const result = instance.url("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe("/__tests__/fixtures/duplicate-1.jpg");
});

test("basePath", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
  });
  const result = instance.url("duplicate-1.jpg");

  return expect(result).resolves.toBe("/duplicate-1.jpg");
});

test("baseUrl", () => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes",
  });
  const result = instance.url("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe(
    "http://example.com/wp-content/themes/__tests__/fixtures/duplicate-1.jpg"
  );
});

test("loadPaths", () => {
  const instance = new Assets({
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
  });
  const result = instance.url("picture.png");

  return expect(result).resolves.toBe("/__tests__/fixtures/images/picture.png");
});

test("relativeTo", () => {
  const instance = new Assets({
    relativeTo: "__tests__/fixtures/fonts",
  });
  const result = instance.url("__tests__/fixtures/images/picture.png");

  return expect(result).resolves.toBe("../images/picture.png");
});

test("basePath + baseUrl", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
  });
  const result = instance.url("duplicate-1.jpg");

  return expect(result).resolves.toBe(
    "http://example.com/wp-content/themes/duplicate-1.jpg"
  );
});

test("basePath + loadPaths", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const result = instance.url("picture.png");

  return expect(result).resolves.toBe("/images/picture.png");
});

test("basePath + relativeTo", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    relativeTo: "fonts",
  });
  const result = instance.url("images/picture.png");

  return expect(result).resolves.toBe("../images/picture.png");
});

test("baseUrl + loadPaths", () => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
  });
  const result = instance.url("picture.png");

  return expect(result).resolves.toBe(
    "http://example.com/wp-content/themes/__tests__/fixtures/images/picture.png"
  );
});

test("baseUrl + relativeTo", () => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "__tests__/fixtures/fonts",
  });
  const result = instance.url("__tests__/fixtures/images/picture.png");

  return expect(result).resolves.toBe("../images/picture.png");
});

test("loadPaths + relativeTo", () => {
  const instance = new Assets({
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
    relativeTo: "__tests__/fixtures/fonts",
  });
  const result = instance.url("picture.png");

  return expect(result).resolves.toBe("../images/picture.png");
});

test("basePath + baseUrl + loadPaths", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
  });
  const result = instance.url("picture.png");

  return expect(result).resolves.toBe(
    "http://example.com/wp-content/themes/images/picture.png"
  );
});

test("basePath + baseUrl + relativeTo", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "fonts",
  });
  const result = instance.url("images/picture.png");

  return expect(result).resolves.toBe("../images/picture.png");
});

test("basePath + loadPaths + relativeTo", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });
  const result = instance.url("picture.png");

  return expect(result).resolves.toBe("../images/picture.png");
});

test("baseUrl + loadPaths + relativeTo", () => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["__tests__/fixtures/fonts", "__tests__/fixtures/images"],
    relativeTo: "__tests__/fixtures/fonts",
  });
  const result = instance.url("picture.png");

  return expect(result).resolves.toBe("../images/picture.png");
});

test("basePath + baseUrl + loadPaths + relativeTo", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });
  const result = instance.url("picture.png");

  return expect(result).resolves.toBe("../images/picture.png");
});

test("absolute basePath + relativeTo", () => {
  const instance = new Assets({
    basePath: path.resolve("__tests__/fixtures"),
    relativeTo: path.resolve("__tests__/fixtures/fonts"),
  });
  const result = instance.url("images/picture.png");

  return expect(result).resolves.toBe("../images/picture.png");
});

test("non-existing file", () => {
  const instance = new Assets();

  return expect(instance.url("non-existing.gif")).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

test("baseUrl w/ trailing slash", () => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes/",
  });
  const result = instance.url("__tests__/fixtures/images/picture.png");

  return expect(result).resolves.toBe(
    "http://example.com/wp-content/themes/__tests__/fixtures/images/picture.png"
  );
});

test("default cachebuster", () => {
  const instance = new Assets({
    cachebuster: true,
  });
  const result = instance.url("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe(
    "/__tests__/fixtures/duplicate-1.jpg?9f057edc00"
  );
});

test("custom cachebuster w/ falsy result", () => {
  const instance = new Assets({
    cachebuster: () => {},
  });
  const result = instance.url("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe("/__tests__/fixtures/duplicate-1.jpg");
});

test("custom cachebuster w/ string result", () => {
  const instance = new Assets({
    cachebuster: () => "bust",
  });
  const result = instance.url("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe(
    "/__tests__/fixtures/duplicate-1.jpg?bust"
  );
});

test("custom cachebuster w/ number result", () => {
  const instance = new Assets({
    cachebuster: () => 42,
  });
  const result = instance.url("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe("/__tests__/fixtures/duplicate-1.jpg?42");
});

test("custom cachebuster w/ pathname", () => {
  const instance = new Assets({
    cachebuster: () => ({ pathname: "/foo.png" }), // TODO leading slash
  });
  const result = instance.url("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe("/foo.png");
});

test("custom cachebuster w/ query", () => {
  const instance = new Assets({
    cachebuster: () => ({ query: "bust" }),
  });
  const result = instance.url("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe(
    "/__tests__/fixtures/duplicate-1.jpg?bust"
  );
});

test("custom cachebuster w/ pathname + query", () => {
  const instance = new Assets({
    cachebuster: () => ({ pathname: "/foo.png", query: "bust" }), // TODO leading slash
  });
  const result = instance.url("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toBe("/foo.png?bust");
});

test("custom cachebuster arguments", () => {
  const cachebuster = jest.fn();

  const instance = new Assets({
    basePath: "__tests__/fixtures",
    cachebuster,
  });
  const result = instance.url("duplicate-1.jpg");

  return result.then(() => {
    expect(cachebuster).toHaveBeenCalledWith(
      path.resolve("__tests__/fixtures/duplicate-1.jpg"),
      "/duplicate-1.jpg"
    );
  });
});

test("query + hash", () => {
  const instance = new Assets();
  const result = instance.url(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  return expect(result).resolves.toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
});

test("query + hash w/ default cachebuster", () => {
  const instance = new Assets({
    cachebuster: true,
  });
  const result = instance.url(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  return expect(result).resolves.toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz&9f057edc00#hash"
  );
});

test("query + hash w/ custom cachebuster w/ falsy result", () => {
  const instance = new Assets({
    cachebuster: () => {},
  });
  const result = instance.url(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  return expect(result).resolves.toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );
});

test("query + hash w/ custom cachebuster w/ string result", () => {
  const instance = new Assets({
    cachebuster: () => "bust",
  });
  const result = instance.url(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  return expect(result).resolves.toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz&bust#hash"
  );
});

test("query + hash w/ custom cachebuster w/ pathname", () => {
  const instance = new Assets({
    cachebuster: () => ({ pathname: "/foo.png" }), // TODO leading slash
  });
  const result = instance.url(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  return expect(result).resolves.toBe("/foo.png?foo=bar&baz#hash");
});

test("query + hash w/ custom cachebuster w/ query", () => {
  const instance = new Assets({
    cachebuster: () => ({ query: "bust" }),
  });
  const result = instance.url(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  return expect(result).resolves.toBe(
    "/__tests__/fixtures/images/picture.png?foo=bar&baz&bust#hash"
  );
});

test("query + hash w/ custom cachebuster w/ pathname + query", () => {
  const instance = new Assets({
    cachebuster: () => ({ pathname: "/foo.png", query: "bust" }), // TODO leading slash
  });
  const result = instance.url(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  return expect(result).resolves.toBe("/foo.png?foo=bar&baz&bust#hash");
});

test("query + hash w/ relativeTo", () => {
  const instance = new Assets({
    relativeTo: "__tests__/fixtures/fonts",
  });
  const result = instance.url(
    "__tests__/fixtures/images/picture.png?foo=bar&baz#hash"
  );

  return expect(result).resolves.toBe("../images/picture.png?foo=bar&baz#hash");
});

test("URI-encoded needle", () => {
  const instance = new Assets();
  const result = instance.url("__tests__/fixtures/white%20space.txt");

  return expect(result).resolves.toBe("/__tests__/fixtures/white%20space.txt");
});

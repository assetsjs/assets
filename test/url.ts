import fs from "fs";
import path from "path";
import sinon from "sinon";
import test from "ava";

import Assets from "../src/index";

let statSyncStub: sinon.SinonStub;

test.before(() => {
  statSyncStub = sinon.stub(fs, "statSync").returns({
    mtime: new Date(Date.UTC(1991, 7, 24)),
  } as fs.Stats);
});

test.after(() => {
  statSyncStub.restore();
});

test("w/o options", (t) => {
  const instance = new Assets();

  return instance.url("test/fixtures/duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg");
  });
});

test("basePath", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
  });

  return instance.url("duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "/duplicate-1.jpg");
  });
});

test("baseUrl", (t) => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes",
  });

  return instance.url("test/fixtures/duplicate-1.jpg").then((resolvedUrl) => {
    t.is(
      resolvedUrl,
      "http://example.com/wp-content/themes/test/fixtures/duplicate-1.jpg"
    );
  });
});

test("loadPaths", (t) => {
  const instance = new Assets({
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });

  return instance.url("picture.png").then((resolvedUrl) => {
    t.is(resolvedUrl, "/test/fixtures/images/picture.png");
  });
});

test("relativeTo", (t) => {
  const instance = new Assets({
    relativeTo: "test/fixtures/fonts",
  });

  return instance
    .url("test/fixtures/images/picture.png")
    .then((resolvedUrl) => {
      t.is(resolvedUrl, "../images/picture.png");
    });
});

test("basePath + baseUrl", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
  });

  return instance.url("duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "http://example.com/wp-content/themes/duplicate-1.jpg");
  });
});

test("basePath + loadPaths", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  return instance.url("picture.png").then((resolvedUrl) => {
    t.is(resolvedUrl, "/images/picture.png");
  });
});

test("basePath + relativeTo", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    relativeTo: "fonts",
  });

  return instance.url("images/picture.png").then((resolvedUrl) => {
    t.is(resolvedUrl, "../images/picture.png");
  });
});

test("baseUrl + loadPaths", (t) => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
  });

  return instance.url("picture.png").then((resolvedUrl) => {
    t.is(
      resolvedUrl,
      "http://example.com/wp-content/themes/test/fixtures/images/picture.png"
    );
  });
});

test("baseUrl + relativeTo", (t) => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "test/fixtures/fonts",
  });

  return instance
    .url("test/fixtures/images/picture.png")
    .then((resolvedUrl) => {
      t.is(resolvedUrl, "../images/picture.png");
    });
});

test("loadPaths + relativeTo", (t) => {
  const instance = new Assets({
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
    relativeTo: "test/fixtures/fonts",
  });

  return instance.url("picture.png").then((resolvedUrl) => {
    t.is(resolvedUrl, "../images/picture.png");
  });
});

test("basePath + baseUrl + loadPaths", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
  });

  return instance.url("picture.png").then((resolvedUrl) => {
    t.is(
      resolvedUrl,
      "http://example.com/wp-content/themes/images/picture.png"
    );
  });
});

test("basePath + baseUrl + relativeTo", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    relativeTo: "fonts",
  });

  return instance.url("images/picture.png").then((resolvedUrl) => {
    t.is(resolvedUrl, "../images/picture.png");
  });
});

test("basePath + loadPaths + relativeTo", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });

  return instance.url("picture.png").then((resolvedUrl) => {
    t.is(resolvedUrl, "../images/picture.png");
  });
});

test("baseUrl + loadPaths + relativeTo", (t) => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["test/fixtures/fonts", "test/fixtures/images"],
    relativeTo: "test/fixtures/fonts",
  });

  return instance.url("picture.png").then((resolvedUrl) => {
    t.is(resolvedUrl, "../images/picture.png");
  });
});

test("basePath + baseUrl + loadPaths + relativeTo", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    baseUrl: "http://example.com/wp-content/themes",
    loadPaths: ["fonts", "images"],
    relativeTo: "fonts",
  });

  return instance.url("picture.png").then((resolvedUrl) => {
    t.is(resolvedUrl, "../images/picture.png");
  });
});

test("absolute basePath + relativeTo", (t) => {
  const instance = new Assets({
    basePath: path.resolve("test/fixtures"),
    relativeTo: path.resolve("test/fixtures/fonts"),
  });

  return instance.url("images/picture.png").then((resolvedUrl) => {
    t.is(resolvedUrl, "../images/picture.png");
  });
});

test("non-existing file", (t) => {
  const instance = new Assets();

  return instance.url("non-existing.gif").then(t.fail, (err: Error) => {
    t.true(err instanceof Error);
    t.is(err.message, "Asset not found or unreadable: non-existing.gif");
  });
});

test("baseUrl w/ trailing slash", (t) => {
  const instance = new Assets({
    baseUrl: "http://example.com/wp-content/themes/",
  });

  return instance
    .url("test/fixtures/images/picture.png")
    .then((resolvedUrl) => {
      t.is(
        resolvedUrl,
        "http://example.com/wp-content/themes/test/fixtures/images/picture.png"
      );
    });
});

test("default cachebuster", (t) => {
  const instance = new Assets({
    cachebuster: true,
  });

  return instance.url("test/fixtures/duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?9f057edc00");
  });
});

test("custom cachebuster w/ falsy result", (t) => {
  const instance = new Assets({
    cachebuster: () => {},
  });

  return instance.url("test/fixtures/duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg");
  });
});

test("custom cachebuster w/ string result", (t) => {
  const instance = new Assets({
    cachebuster: () => "bust",
  });

  return instance.url("test/fixtures/duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?bust");
  });
});

test("custom cachebuster w/ number result", (t) => {
  const instance = new Assets({
    cachebuster: () => 42,
  });

  return instance.url("test/fixtures/duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?42");
  });
});

test("custom cachebuster w/ pathname", (t) => {
  const instance = new Assets({
    cachebuster: () => ({ pathname: "/foo.png" }), // TODO leading slash
  });

  return instance.url("test/fixtures/duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "/foo.png");
  });
});

test("custom cachebuster w/ query", (t) => {
  const instance = new Assets({
    cachebuster: () => ({ query: "bust" }),
  });

  return instance.url("test/fixtures/duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "/test/fixtures/duplicate-1.jpg?bust");
  });
});

test("custom cachebuster w/ pathname + query", (t) => {
  const instance = new Assets({
    cachebuster: () => ({ pathname: "/foo.png", query: "bust" }), // TODO leading slash
  });

  return instance.url("test/fixtures/duplicate-1.jpg").then((resolvedUrl) => {
    t.is(resolvedUrl, "/foo.png?bust");
  });
});

test("custom cachebuster arguments", (t) => {
  const cachebuster = sinon.spy();

  const instance = new Assets({
    basePath: "test/fixtures",
    cachebuster,
  });

  return instance.url("duplicate-1.jpg").then(() => {
    t.true(cachebuster.calledOnce);
    t.is(cachebuster.lastCall.args.length, 2);
    t.is(
      cachebuster.lastCall.args[0],
      path.resolve("test/fixtures/duplicate-1.jpg")
    );
    t.is(cachebuster.lastCall.args[1], "/duplicate-1.jpg");
  }, t.fail);
});

test("query + hash", (t) => {
  const instance = new Assets();

  return instance
    .url("test/fixtures/images/picture.png?foo=bar&baz#hash")
    .then((resolvedUrl) => {
      t.is(resolvedUrl, "/test/fixtures/images/picture.png?foo=bar&baz#hash");
    });
});

test("query + hash w/ default cachebuster", (t) => {
  const instance = new Assets({
    cachebuster: true,
  });

  return instance
    .url("test/fixtures/images/picture.png?foo=bar&baz#hash")
    .then((resolvedUrl) => {
      t.is(
        resolvedUrl,
        "/test/fixtures/images/picture.png?foo=bar&baz&9f057edc00#hash"
      );
    });
});

test("query + hash w/ custom cachebuster w/ falsy result", (t) => {
  const instance = new Assets({
    cachebuster: () => {},
  });

  return instance
    .url("test/fixtures/images/picture.png?foo=bar&baz#hash")
    .then((resolvedUrl) => {
      t.is(resolvedUrl, "/test/fixtures/images/picture.png?foo=bar&baz#hash");
    });
});

test("query + hash w/ custom cachebuster w/ string result", (t) => {
  const instance = new Assets({
    cachebuster: () => "bust",
  });

  return instance
    .url("test/fixtures/images/picture.png?foo=bar&baz#hash")
    .then((resolvedUrl) => {
      t.is(
        resolvedUrl,
        "/test/fixtures/images/picture.png?foo=bar&baz&bust#hash"
      );
    });
});

test("query + hash w/ custom cachebuster w/ pathname", (t) => {
  const instance = new Assets({
    cachebuster: () => ({ pathname: "/foo.png" }), // TODO leading slash
  });

  return instance
    .url("test/fixtures/images/picture.png?foo=bar&baz#hash")
    .then((resolvedUrl) => {
      t.is(resolvedUrl, "/foo.png?foo=bar&baz#hash");
    });
});

test("query + hash w/ custom cachebuster w/ query", (t) => {
  const instance = new Assets({
    cachebuster: () => ({ query: "bust" }),
  });

  return instance
    .url("test/fixtures/images/picture.png?foo=bar&baz#hash")
    .then((resolvedUrl) => {
      t.is(
        resolvedUrl,
        "/test/fixtures/images/picture.png?foo=bar&baz&bust#hash"
      );
    });
});

test("query + hash w/ custom cachebuster w/ pathname + query", (t) => {
  const instance = new Assets({
    cachebuster: () => ({ pathname: "/foo.png", query: "bust" }), // TODO leading slash
  });

  return instance
    .url("test/fixtures/images/picture.png?foo=bar&baz#hash")
    .then((resolvedUrl) => {
      t.is(resolvedUrl, "/foo.png?foo=bar&baz&bust#hash");
    });
});

test("query + hash w/ relativeTo", (t) => {
  const instance = new Assets({
    relativeTo: "test/fixtures/fonts",
  });

  return instance
    .url("test/fixtures/images/picture.png?foo=bar&baz#hash")
    .then((resolvedUrl) => {
      t.is(resolvedUrl, "../images/picture.png?foo=bar&baz#hash");
    });
});

test("URI-encoded needle", (t) => {
  const instance = new Assets();

  return instance.url("test/fixtures/white%20space.txt").then((resolvedUrl) => {
    t.is(resolvedUrl, "/test/fixtures/white%20space.txt");
  });
});

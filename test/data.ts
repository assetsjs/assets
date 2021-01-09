import test from "ava";

import Assets from "../src/index";

test("w/o options", (t) => {
  const instance = new Assets();

  return instance
    .data("test/fixtures/duplicate-1.jpg")
    .then((resolvedDataUrl) => {
      t.is(resolvedDataUrl.slice(0, 32), "data:image/jpeg;base64,/9j/4AAQS");
      t.is(resolvedDataUrl.slice(-32), "GWbO3rSpUIsvhA1vsPh/WlSpVprP/9k=");
    });
});

test("basePath + loadPaths", (t) => {
  const instance = new Assets({
    basePath: "test/fixtures",
    loadPaths: ["fonts", "images"],
  });

  return instance.data("picture.png").then((resolvedDataUrl) => {
    t.is(resolvedDataUrl.slice(0, 32), "data:image/png;base64,iVBORw0KGg");
    t.is(resolvedDataUrl.slice(-32), "+BPCufaJraBKlQAAAABJRU5ErkJggg==");
  });
});

test("discard query + preserve hash", (t) => {
  const instance = new Assets();

  return instance
    .data("test/fixtures/duplicate-1.jpg?foo=bar#hash")
    .then((resolvedDataUrl) => {
      t.is(resolvedDataUrl.slice(0, 32), "data:image/jpeg;base64,/9j/4AAQS");
      t.is(resolvedDataUrl.slice(-32), "rSpUIsvhA1vsPh/WlSpVprP/9k=#hash");
    });
});

test("svg", (t) => {
  const instance = new Assets();

  return instance
    .data("test/fixtures/images/vector.svg")
    .then((resolvedDataUrl) => {
      t.is(resolvedDataUrl.slice(0, 32), "data:image/svg+xml;charset=utf-8");
      t.is(resolvedDataUrl.slice(-32), "0h80z%22%2F%3E%0D%0A%3C%2Fsvg%3E");
    });
});

test("non-existing file", (t) => {
  const instance = new Assets();

  return instance.data("non-existing.gif").then(t.fail, (err: Error) => {
    t.true(err instanceof Error);
    t.is(err.message, "Asset not found or unreadable: non-existing.gif");
  });
});

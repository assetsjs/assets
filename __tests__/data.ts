import Assets from "../src/index";

test("w/o options", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/duplicate-1.jpg");

  await expect(asset.toDataURL()).resolves.toMatch(
    /^data:image\/jpeg;base64,\/9j\/4AAQS.*GWbO3rSpUIsvhA1vsPh\/WlSpVprP\/9k=$/
  );
});

test("basePath + loadPaths", async () => {
  const resolver = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const asset = await resolver.resolve("picture.png");

  await expect(asset.toDataURL()).resolves.toMatch(
    /^data:image\/png;base64,iVBORw0KGg.+\+BPCufaJraBKlQAAAABJRU5ErkJggg==$/
  );
});

test("discard search + preserve hash", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve(
    "__tests__/fixtures/duplicate-1.jpg?foo=bar#hash"
  );

  await expect(asset.toDataURL()).resolves.toMatch(
    /^data:image\/jpeg;base64,\/9j\/4AAQS.+rSpUIsvhA1vsPh\/WlSpVprP\/9k=#hash$/
  );
});

test("svg", async () => {
  const resolver = new Assets();
  const asset = await resolver.resolve("__tests__/fixtures/images/vector.svg");

  return expect(asset.toDataURL()).resolves.toMatch(
    /^data:image\/svg\+xml;charset=utf-8.+0h80z%22%2F%3E%0D%0A%3C%2Fsvg%3E$/
  );
});

test("non-existing file", async () => {
  const resolver = new Assets();

  await expect(resolver.resolve("non-existing.gif")).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

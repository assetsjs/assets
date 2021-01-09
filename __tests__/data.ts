import Assets from "../src/index";

test("w/o options", () => {
  const instance = new Assets();
  const result = instance.data("__tests__/fixtures/duplicate-1.jpg");

  return expect(result).resolves.toMatch(
    /^data:image\/jpeg;base64,\/9j\/4AAQS.*GWbO3rSpUIsvhA1vsPh\/WlSpVprP\/9k=$/
  );
});

test("basePath + loadPaths", () => {
  const instance = new Assets({
    basePath: "__tests__/fixtures",
    loadPaths: ["fonts", "images"],
  });
  const result = instance.data("picture.png");

  return expect(result).resolves.toMatch(
    /^data:image\/png;base64,iVBORw0KGg.+\+BPCufaJraBKlQAAAABJRU5ErkJggg==$/
  );
});

test("discard query + preserve hash", () => {
  const instance = new Assets();
  const result = instance.data(
    "__tests__/fixtures/duplicate-1.jpg?foo=bar#hash"
  );

  return expect(result).resolves.toMatch(
    /^data:image\/jpeg;base64,\/9j\/4AAQS.+rSpUIsvhA1vsPh\/WlSpVprP\/9k=#hash$/
  );
});

test("svg", () => {
  const instance = new Assets();
  const result = instance.data("__tests__/fixtures/images/vector.svg");

  return expect(result).resolves.toMatch(
    /^data:image\/svg\+xml;charset=utf-8.+0h80z%22%2F%3E%0D%0A%3C%2Fsvg%3E$/
  );
});

test("non-existing file", () => {
  const instance = new Assets();
  const result = instance.data("non-existing.gif");

  return expect(result).rejects.toThrow(
    "Asset not found or unreadable: non-existing.gif"
  );
});

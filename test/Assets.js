const test = require("ava");

const Assets = require("..");

test("constructor", (t) => {
  t.deepEqual(typeof Assets, "function", "is a function");
  t.true(Assets() instanceof Assets, "instantiable without new");
  t.true(Object.isFrozen(new Assets()), "is frozen");
});

test(".options", (t) => {
  const options = { basePath: "source" };
  t.deepEqual(new Assets().options, {}, "defaults to an empty object");
  t.deepEqual(new Assets(options).options.basePath, "source", "is initiable");
  t.not(new Assets(options).options, options, "breaks the reference");
});

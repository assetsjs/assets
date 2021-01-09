import test from "ava";

import Assets from "../src/index";

test("constructor", (t) => {
  t.deepEqual(typeof Assets, "function", "is a function");
});

test(".options", (t) => {
  const options = { basePath: "source" };
  t.deepEqual(new Assets().options, {}, "defaults to an empty object");
  t.deepEqual(new Assets(options).options.basePath, "source", "is initiable");
  t.not(new Assets(options).options, options, "breaks the reference");
});

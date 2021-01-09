import test from "ava";

import Assets from "../src/index";

test("constructor", (t) => {
  t.deepEqual(typeof Assets, "function", "is a function");
});

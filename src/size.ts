import calipers from "calipers";
import gif from "calipers-gif";
import jpeg from "calipers-jpeg";
import png from "calipers-png";
import svg from "calipers-svg";
import webp from "calipers-webp";

import resolvePath from "./path";
import { Dimensions, Options } from "./types";

const Calipers = calipers(webp, png, jpeg, gif, svg);

export default (to: string, options: Options): Promise<Dimensions> =>
  resolvePath(to, options).then((resolvedPath) =>
    Calipers.measure(resolvedPath)
      .then((result) => result.pages[0])
      .catch((err: Error) =>
        Promise.reject(new Error(`${err.message}: ${resolvedPath}`))
      )
  );

import calipers from "calipers";
import webp from "calipers-webp";
import png from "calipers-png";
import jpeg from "calipers-jpeg";
import gif from "calipers-gif";
import svg from "calipers-svg";
import resolvePath from "./path";

const Calipers = calipers(webp, png, jpeg, gif, svg);

export default (to: string, options: any): Promise<any> =>
  resolvePath(to, options).then((resolvedPath) =>
    Calipers.measure(resolvedPath)
      .then((result) => result.pages[0])
      .catch((err: Error) =>
        Promise.reject(new Error(`${err.message}: ${resolvedPath}`))
      )
  );

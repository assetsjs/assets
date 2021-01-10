import url from "url";

import Asset from "./Asset";
import resolvePath from "./path";
import { Options } from "./types";

class Assets {
  constructor(private options: Options = {}) {}

  resolve(path: string): Promise<Asset> {
    const urlObject = url.parse(path);

    if (!urlObject.pathname) {
      throw new Error();
    }

    return resolvePath(decodeURI(urlObject.pathname), this.options).then(
      (resolvedPath) =>
        new Asset(
          resolvedPath,
          urlObject.search || "",
          urlObject.hash || "",
          this.options.basePath || "."
        )
    );
  }
}

export default Assets;

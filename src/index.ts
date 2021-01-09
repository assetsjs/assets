import url from "url";

import Asset from "./Asset";
import resolvePath from "./path";
import resolveSize from "./size";
import { Dimensions, Options } from "./types";
import resolveUrl from "./url";

class Assets {
  constructor(private options: Options = {}) {}

  resolve(path: string): Promise<Asset> {
    const urlObject = url.parse(path);

    if (!urlObject.pathname) {
      throw new Error();
    }

    return resolvePath(urlObject.pathname, this.options).then(
      (resolvedPath) => new Asset(resolvedPath, urlObject.hash || "")
    );
  }

  path(path: string): Promise<string> {
    return resolvePath(path, this.options);
  }

  size(path: string): Promise<Dimensions> {
    return resolveSize(path, this.options);
  }

  url(path: string): Promise<string> {
    return resolveUrl(path, this.options);
  }
}

export default Assets;

import resolveData from "./data";
import resolvePath from "./path";
import resolveSize from "./size";
import { Dimensions, Options } from "./types";
import resolveUrl from "./url";

class Assets {
  constructor(private options: Options = {}) {}

  data(path: string): Promise<string> {
    return resolveData(path, this.options);
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

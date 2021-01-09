import extend from "lodash/extend";
import resolveData from "./data";
import resolvePath from "./path";
import resolveSize from "./size";
import resolveUrl from "./url";

class Assets {
  options: any;

  constructor(options = {}) {
    this.options = extend({}, options);
  }

  data(path: string): Promise<any> {
    return resolveData(path, this.options);
  }

  path(path: string): Promise<any> {
    return resolvePath(path, this.options);
  }

  size(path: string): Promise<any> {
    return resolveSize(path, this.options);
  }

  url(path: string): Promise<any> {
    return resolveUrl(path, this.options);
  }
}

export default Assets;

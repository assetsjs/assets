import { promises as fsPromises } from "fs";

import calipers from "calipers";
import gif from "calipers-gif";
import jpeg from "calipers-jpeg";
import png from "calipers-png";
import svg from "calipers-svg";
import webp from "calipers-webp";
import mime from "mime";

import encodeBuffer from "./__utils__/encodeBuffer";
import { Dimensions } from "./types";

const Calipers = calipers(webp, png, jpeg, gif, svg);

class Asset {
  constructor(public readonly path: string, public readonly hash: string) {}

  getDimensions(): Promise<Dimensions> {
    return Calipers.measure(this.path)
      .then((result) => result.pages[0])
      .catch((err: Error) =>
        Promise.reject(new Error(`${err.message}: ${this.path}`))
      );
  }

  toDataURL(): Promise<string> {
    const mediaType = mime.getType(this.path);

    if (!mediaType) {
      throw new Error();
    }

    return fsPromises.readFile(this.path).then((buffer) => {
      const content = encodeBuffer(buffer, mediaType);
      return `data:${mediaType};${content}${this.hash}`;
    });
  }
}

export default Asset;

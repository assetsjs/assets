import { promises as fsPromises } from "fs";

import mime from "mime";

import encodeBuffer from "./__utils__/encodeBuffer";

class Asset {
  constructor(public readonly path: string, public readonly hash: string) {}

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

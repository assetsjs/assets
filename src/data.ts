import { promises as fsPromises } from "fs";
import mime from "mime";
import url from "url";
import resolvePath from "./path";
import { Options } from "./types";
import encodeBuffer from "./__utils__/encodeBuffer";

export default (to: string, options: Options): Promise<string> => {
  const toUrl = url.parse(to);

  if (!toUrl.pathname) {
    throw new Error();
  }

  return resolvePath(toUrl.pathname, options).then((resolvedPath) => {
    const mediaType = mime.getType(resolvedPath);

    if (!mediaType) {
      throw new Error();
    }

    return fsPromises.readFile(resolvedPath).then((buffer) => {
      const content = encodeBuffer(buffer, mediaType);
      return `data:${mediaType};${content}${toUrl.hash || ""}`;
    });
  });
};

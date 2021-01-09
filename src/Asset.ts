import { promises as fsPromises } from "fs";

import calipers from "calipers";
import gif from "calipers-gif";
import jpeg from "calipers-jpeg";
import png from "calipers-png";
import svg from "calipers-svg";
import webp from "calipers-webp";
import mime from "mime";

import composeAbsolutePathname from "./__utils__/composeAbsolutePathname";
import composeQueryString from "./__utils__/composeQueryString";
import composeRelativePathname from "./__utils__/composeRelativePathname";
import defaultCachebuster from "./__utils__/defaultCachebuster";
import encodeBuffer from "./__utils__/encodeBuffer";
import { CachebusterFunction, Dimensions } from "./types";

type ToURLOptions = {
  cachebuster?: CachebusterFunction | boolean;
  relativeTo?: string | false;
};

const Calipers = calipers(webp, png, jpeg, gif, svg);

class Asset {
  constructor(
    public readonly path: string,
    public readonly query: string,
    public readonly hash: string,
    private readonly basePath: string,
    private readonly baseURL: string
  ) {}

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

  toURL({ cachebuster, relativeTo = false }: ToURLOptions = {}): string {
    // TODO: Test for empty string
    const pathname =
      relativeTo === false
        ? composeAbsolutePathname(this.baseURL, this.basePath, this.path)
        : composeRelativePathname(this.basePath, relativeTo, this.path);
    if (cachebuster) {
      const cb = cachebuster === true ? defaultCachebuster : cachebuster;
      const cachebusterOutput = cb(this.path, pathname);

      if (typeof cachebusterOutput === "object") {
        if (cachebusterOutput.pathname && cachebusterOutput.query) {
          return `${cachebusterOutput.pathname}${composeQueryString(
            this.query,
            cachebusterOutput.query
          )}${this.hash}`;
        }

        if (cachebusterOutput.pathname) {
          return `${cachebusterOutput.pathname}${this.query}${this.hash}`;
        }

        if (cachebusterOutput.query) {
          return `${pathname}${composeQueryString(
            this.query,
            cachebusterOutput.query
          )}${this.hash}`;
        }
      } else if (cachebusterOutput) {
        return `${pathname}${composeQueryString(
          this.query,
          String(cachebusterOutput)
        )}${this.hash}`;
      }
    }
    return `${pathname}${this.query}${this.hash}`;
  }
}

export default Asset;

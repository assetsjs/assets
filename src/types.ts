export type CachebusterFunction = (
  resolvedPath: string,
  pathname: string
) => { pathname?: string; search?: string } | number | string | void;

export type Dimensions = {
  height: number;
  width: number;
};

export type Options = {
  basePath?: string;
  loadPaths?: string | string[];
};

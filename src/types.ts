export type CachebusterFunction = (
  resolvedPath: string,
  pathname: string
) => { pathname?: string; query?: string } | number | string | void;

export type Options = {
  basePath?: string;
  baseUrl?: string;
  cachebuster?: CachebusterFunction | boolean;
  loadPaths?: string | string[];
  relativeTo?: string | false;
};

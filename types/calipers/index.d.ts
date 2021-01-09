type Plugin = {
  detect: (buffer: Buffer) => boolean;
  measure: (path: string, fd: number) => Result | Promise<Result>;
};

type Result = {
  type: string;
  pages: { height: number; width: number }[];
};

declare module "calipers" {
  type Constructor = (...plugins: Plugin[] | string[]) => Calipers;

  type Calipers = {
    measure: (
      filePath: string,
      callback?: (err: Error | null, result: Result) => void
    ) => Promise<Result>;
  };

  const constructor: Constructor;
  export default constructor;
}

declare module "calipers-gif" {
  const plugin: Plugin;
  export default plugin;
}

declare module "calipers-jpeg" {
  const plugin: Plugin;
  export default plugin;
}

declare module "calipers-png" {
  const plugin: Plugin;
  export default plugin;
}

declare module "calipers-svg" {
  const plugin: Plugin;
  export default plugin;
}

declare module "calipers-webp" {
  const plugin: Plugin;
  export default plugin;
}

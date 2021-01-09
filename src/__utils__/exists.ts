import fs from "fs";

export default (
  filePath: string,
  callback: (err: NodeJS.ErrnoException | null, exists: boolean) => void
): void => {
  fs.stat(filePath, (err) => {
    callback(null, err === null);
  });
};

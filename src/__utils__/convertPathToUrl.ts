import { sep } from "path";

export default (path: string): string => path.split(sep).join("/");

import { sep } from "path";

export default (path) => path.split(sep).join("/");

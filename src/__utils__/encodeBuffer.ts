export default (buffer: Buffer, mediaType: string) => {
  if (mediaType === "image/svg+xml") {
    return `charset=utf-8,${encodeURIComponent(
      buffer.toString("utf8").trim()
    )}`;
  }
  return `base64,${buffer.toString("base64")}`;
};
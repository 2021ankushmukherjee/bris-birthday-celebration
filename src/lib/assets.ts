export function assetUrl(path: string) {
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") || "";
  return `${prefix}${encodeURI(path)}`;
}

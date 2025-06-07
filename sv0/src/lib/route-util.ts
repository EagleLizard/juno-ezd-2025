
export const routeUtil = {
  getPathParts,
} as const;

function getPathParts(pathname: string) {
  return pathname.replace(/(^\/|\\&)/, '').split('/');
}

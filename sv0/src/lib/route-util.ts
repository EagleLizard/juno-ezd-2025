
export const routeUtil = {
  getPathParts,
  checkPath,
} as const;

function getPathParts(pathname: string) {
  return trimPath(pathname).split('/');
}

function trimPath(pathname: string) {
  return pathname.replace(/(^\/+|\/+$)/g, '');
}

function checkPath(pathname: string) {
  let rx = /^(\/|(\/:?[a-zA-Z0-9-]+)+\/?)$/g;
  let res = rx.test(pathname);
  return res;
}

/*
Find the longest common prefix of path parts
_*/
function pathMatch(path1: string, path2: string) {
  // let rx = /\/?(^\/?)/g
}


export const routeUtil = {
  getPathParts,
  checkPath,
} as const;

function getPathParts(pathname: string) {
  return trimPath(pathname).split('/');
}

function trimPath(pathname: string) {
  // return pathname.replace(/(^\/+|\/+$)/g, '');
  return pathname.replace(/(^\/|\/?$)/g, '');
}

function checkPath(pathname: string): string[] | undefined {
  /*
    Initially validated with a single regex, however, the regex seems overly
      complex if I want to add support for named path params; a path param will
      necessarily have a different identifier syntax. I also may want to use a
      path parameter syntax that differs from status-quo.
    E.g.:
      /path/to/:some_param
      /path/to/{someParam}
    Original regex:
      /^(\/|(\/:?[a-zA-Z0-9-]+)+\/?)$/g
  _*/
  /*
    1. Validate leading & trailing slashes
  _*/
  // let slashRx = /^\/(?!\/)(.+\/?)?$/g;
  let slashRx = /^\/(?!\/)([^/\s]+\/?)*?$/g;
  if(!slashRx.test(pathname)) {
    return undefined;
  }
  let pathParts = getPathParts(pathname);
  let isValidPath: boolean;
  isValidPath = pathParts.every(pathPart => {
    return checkPathPart(pathPart);
  });
  if(isValidPath) {
    return pathParts;
  }
  return undefined;
}

function checkPathPart(pathPart: string): boolean {
  let isParamIdentifier: boolean = pathPart.startsWith(':');
  if(isParamIdentifier) {
    /* validate param identifier */
    return false;
  } else {
    /* validate url pathname part */
    let rx = /^[a-zA-Z0-9-]*$/;
    return rx.test(pathPart);
  }
}

/*
Find the longest common prefix of path parts
_*/
function pathMatch(path1: string, path2: string) {
  // let rx = /\/?(^\/?)/g
}

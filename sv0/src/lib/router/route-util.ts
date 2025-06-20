
const PATH_PARAM_PREFIX = '$';

export const routeUtil = {
  getPathParts,
  checkPath,
  normalize,
} as const;

function getPathParts(pathname: string) {
  return trimPath(pathname).split('/');
}

function trimPath(pathname: string) {
  // return pathname.replace(/(^\/+|\/+$)/g, '');
  // return pathname.replace(/(^\/|\/?$)/g, '');
  return pathname.replace(/(^\/|\/?$)/g, '');
}

/*
  Formats a valid pathname to an expected format, e.g.:
    /path/to/something/ -> /path/to/something
    /path/to/something -> /path/to/something
_*/
function normalize(pathname: string): string {
  let res: string;
  if(!checkPath(pathname)) {
    throw new Error(`Cannot normalize invalid pathname: ${pathname}`);
  }
  res = `/${trimPath(pathname)}`;
  return res;
}

function checkPath(pathname: string): boolean {
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
    return false;
  }
  let pathParts = getPathParts(pathname);
  let isValidPath: boolean;
  if(pathParts.length === 1 && pathParts[0].length < 1) {
    /*
      empty str is valid '/' path
    _*/
    return true;
  }
  isValidPath = pathParts.every(pathPart => {
    return checkPathPart(pathPart);
  });
  if(isValidPath) {
    return true;
  }
  return false;
}

function checkPathPart(pathPart: string): boolean {
  let isPathParam: boolean;
  isPathParam = checkPathParam(pathPart);
  let validPathPart: boolean;
  validPathPart = (
    checkPathParam(pathPart)
    || checkPathPartStr(pathPart)
  );
  return validPathPart;
}

function checkPathPartStr(pathPart: string) {
  let pathPartRx = /^[a-zA-Z0-9-]+$/;
  return pathPartRx.test(pathPart);
}

/*
  valid params:
    $name
    $itemId
    $some_val
_*/
function checkPathParam(pathPart: string): boolean {
  let validPrefix: boolean;
  validPrefix = pathPart.startsWith(PATH_PARAM_PREFIX);
  if(!validPrefix) {
    return false;
  }
  let paramStr = pathPart.substring(1);
  let rx = /^[\w]+/;
  return rx.test(paramStr);
}

/*
Find the longest common prefix of path parts
_*/
function pathMatch(path1: string, path2: string) {
  // let rx = /\/?(^\/?)/g
}

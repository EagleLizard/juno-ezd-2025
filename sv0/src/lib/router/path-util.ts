
const path_part_kinds = {
  literal: 'literal',
  param: 'param',
  wildcard: 'wildcard',
} as const;

export const pathUtil = {
  path_part_kinds,
  parsePathParts,
  getPathStrs,
  literalMatch,
  paramMatch,
  wildcardMatch,
  normalize,
} as const;

export type PathPart = {
  /*
    Copied some stuff from tanstack router verbatim.
      see: https://github.com/TanStack/router/blob/3bb4813d1d010eeaec06091bb1cab59307e5b911/packages/router-core/src/path.ts#L5
  _*/
  // kind: 'exact' | 'param' | 'wildcard';
  kind: keyof typeof path_part_kinds,
  val: string;
};

function normalize(pathname: string): string {
  let normal: string;
  normal = trimPathname(pathname);
  return normal;
}

function literalMatch(pathPart: PathPart, pathStr: string): boolean {
  return pathPart.kind === 'literal' && pathPart.val === pathStr;
}

function paramMatch(pathPart: PathPart, pathStr: string): boolean {
  return pathPart.kind === 'param' && pathStr.length > 0;
}

function wildcardMatch(pathPart: PathPart, pathStr: string): boolean {
  if(pathPart.kind !== 'wildcard') {
    return false;
  }
  return !checkExactPathStr(pathStr);
}

/*
  Parse a pathname into strings
_*/
function getPathStrs(pathname: string): string[] {
  let partStrs: string[] = [];
  pathname = trimPathname(pathname);
  partStrs = pathname.split('/');
  if(partStrs[0].length === 0) {
    /* 1st part can be a base */
    partStrs[0] = '/';
  }
  return partStrs;
}

/*
  Parse a path into PathParts
_*/
function parsePathParts(pathname: string): PathPart[] {
  let pathParts: PathPart[] = [];
  let pathPartStrs = getPathStrs(pathname);
  if(pathPartStrs[0]?.length < 1) {
    pathParts.push({
      kind: 'literal',
      val: '/',
    });
    pathPartStrs = pathPartStrs.slice(1);
  }
  for(let i = 0; i < pathPartStrs.length; ++i) {
    let pathPartStr = pathPartStrs[i];
    let pathPart = parsePathPart(pathPartStr);
    pathParts.push(pathPart);
  }
  return pathParts;
}

function parsePathPart(pathPartStr: string): PathPart {
  let paramRx = getParamRx();
  let wildcardRx = getWildcardRx();
  let pathPart: PathPart;
  if(paramRx.test(pathPartStr)) {
    pathPart = {
      kind: 'param',
      val: pathPartStr,
    };
    return pathPart;
  } else if (wildcardRx.test(pathPartStr)) {
    pathPart = {
      kind: 'wildcard',
      val: '$',
    };
    return pathPart;
  }
  /* default case is pathname */
  pathPart = {
    kind: 'literal',
    val: pathPartStr,
  };
  return pathPart;
}

function checkExactPathStr(pathStr: string): boolean {
  return !getParamRx().test(pathStr) && !getWildcardRx().test(pathStr);
}

function checkParamPathStr(pathStr: string): boolean {
  return getParamRx().test(pathStr);
}

function getParamRx(): RegExp {
  return /^\$[a-zA-Z0-9]+$/g;
}

function getWildcardRx(): RegExp {
  return /^\$$/;
}

function trimPathname(pathname: string): string {
  // return pathname.replace(/(^\/(?=\/)$)/g, '');
  return pathname.replace(/(^\/(?=\/)|\/?$)/g, '');
}

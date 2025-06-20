
export const pathUtil = {
  parsePathname,
} as const;

export type PathPart = {
  /*
    Copied some stuff from tanstack router verbatim.
      see: https://github.com/TanStack/router/blob/3bb4813d1d010eeaec06091bb1cab59307e5b911/packages/router-core/src/path.ts#L5
  _*/
  kind: 'pathname' | 'param' | 'wildcard';
  val: string;
};

/*
  Parse a path.
_*/
function parsePathname(pathname: string): PathPart[] {
  let pathParts: PathPart[] = [];
  pathname = trimPathname(pathname);
  let pathPartStrs = pathname.split('/');
  if(pathPartStrs[0]?.length < 1) {
    pathParts.push({
      kind: 'pathname',
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
  let paramRx = /^\$[a-zA-Z0-9]+$/g;
  let wildcardRx = /^\$$/;
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
    kind: 'pathname',
    val: pathPartStr,
  };
  return pathPart;
}

function trimPathname(pathname: string): string {
  // return pathname.replace(/(^\/(?=\/)$)/g, '');
  return pathname.replace(/(^\/(?=\/)|\/?$)/g, '');
}

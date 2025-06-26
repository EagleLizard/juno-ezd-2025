import { PathNode } from './path-node';
import { pathUtil, type PathPart } from './path-util';

type PathMatchRes = {
  params: Map<string, string>;
};

export class RouteTree {
  _root: PathNode;
  routeMap: Map<string, PathNode>;
  constructor() {
    this._root = PathNode.newRoot();
    this.routeMap = new Map();
  }
  insert(route: string): void {
    route = pathUtil.normalize(route);
    let pathParts = pathUtil.parsePathParts(route);
    if(pathParts.at(0)?.val === this._root.value.val) {
      pathParts = pathParts.slice(1);
    }
    let insertedNode = this._root.insert(pathParts);
    this.routeMap.set(route, insertedNode);
  }
  hasRoute(route: string): boolean {
    let res: boolean;
    route = pathUtil.normalize(route);
    res = this.routeMap.has(route);
    return res;
  }
  matchPath(pathname: string): PathMatchRes | undefined {
    let pathMatchRes: PathMatchRes;
    let paramMap: Map<string, string>;
    let pathParts: PathPart[];
    let pathStrs = pathUtil.getPathStrs(pathname);
    let matchedNode = this._root.matchPath(pathStrs);
    if(matchedNode === undefined || !this.hasNode(matchedNode)) {
      return;
    }
    /*
      A match against a pathname should return any params or wildcards
        that were matched
    _*/
    paramMap = new Map();
    pathParts = getNodesToRoot(matchedNode).map(nodeToRoot => nodeToRoot.value);
    for(let i = 0; i < pathStrs.length; ++i) {
      let pathStr = pathStrs[i];
      let pathPart = pathParts[i];
      if(pathPart.kind === pathUtil.path_part_kinds.param) {
        paramMap.set(pathPart.val, pathStr);
      }
    }
    pathMatchRes = {
      params: paramMap,
    };
    return pathMatchRes;
  }
  /*
    Checks if the given PathNode is a leaf that corresponds to a registered route
  _*/
  private hasNode(pathNode: PathNode): boolean {
    let valIt = this.routeMap.values();
    let valItRes: IteratorResult<PathNode>;
    while(!(valItRes = valIt.next()).done) {
      let currNode = valItRes.value;
      if(currNode.id === pathNode.id) {
        return true;
      }
    }
    return false;
  }

}

function getNodesToRoot(pathNode: PathNode): PathNode[] {
  let pathNodes: PathNode[] = [];
  (function _helper(currNode: PathNode) {
    if(currNode._parent !== undefined) {
      _helper(currNode._parent);
    }
    pathNodes.push(currNode);
  })(pathNode);
  return pathNodes;
}

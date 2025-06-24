import { PathNode } from './path-node';
import { pathUtil } from './path-util';

type PathMatchRes = {
  params: string[];
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
    let pathStrs = pathUtil.getPathStrs(pathname);
    let matchedNode = this._root.matchPath(pathStrs);
    if(!matchedNode) {
      return;
    }
    /*
      A match against a pathname should return any params or wildcards
        that were matched
    _*/
    let nodesToRoot = getNodesToRoot(matchedNode);
    let pathParts = nodesToRoot.map(nodeToRoot => nodeToRoot.value);
    console.log(pathParts);
    for(let i = 0; i < pathParts.length; ++i) {
      console.log(`${pathStrs[i]} - ${pathParts[i].val}`);
    }
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

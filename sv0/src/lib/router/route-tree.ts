import { RouteNode } from './route-node';
import { routeUtil } from './route-util';

export class RouteTree {
  _root: RouteNode;
  constructor() {
    this._root = RouteNode.newRoot();
  }
  insert(pathname: string): void {
    let pathParts = routeUtil.getPathParts(pathname);
    let insertedNode: RouteNode;
    insertedNode = this._root.insert(pathParts);
    /* set path for leaf nodes (exact) */
    insertedNode.route = pathname;
  }
  hasRoute(pathname: string): boolean {
    let pathParts = routeUtil.getPathParts(pathname);
    return this._root.hasRoute(pathParts);
  }
}

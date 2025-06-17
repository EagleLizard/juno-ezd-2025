import { RouterError } from '../models/errors/router-error';
import { RouteNode } from './route-node';
import { routeUtil } from './route-util';

export class RouteTree {
  _root: RouteNode;
  routeMap: Map<string, RouteNode>;
  constructor() {
    this._root = RouteNode.newRoot();
    this.routeMap = new Map();
  }
  insert(route: string): void {
    if(!routeUtil.checkPath(route)) {
      throw new RouterError(`Invalid pathname: ${route}`);
    }
    let normalRoute = routeUtil.normalize(route);
    if(this.hasRoute(normalRoute)) {
      throw new RouterError(`Attempt to insert duplicate route: ${route}`);
    }
    let pathParts = routeUtil.getPathParts(normalRoute);
    let insertedNode: RouteNode;
    insertedNode = this._root.insert(pathParts);
    this.routeMap.set(normalRoute, insertedNode);
    /* set path for leaf nodes (exact) */
    insertedNode.route = normalRoute;
  }
  hasRoute(pathname: string): boolean {
    return this.routeMap.has(pathname);
  }
}

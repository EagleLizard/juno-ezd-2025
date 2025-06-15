
const ROUTE_NODE_ROOT_VAL = '';

export class RouteNode {
  val: string;
  route?: string;
  _children: RouteNode[];
  _parent?: RouteNode;
  constructor(val: string, parent?: RouteNode) {
    this.val = val;
    this.route = undefined;
    this._children = [];
    this._parent = parent ?? undefined;
  }

  findRouteNode(pathParts: string[]): RouteNode | undefined {
    let pathPart = pathParts[0];
    pathParts = pathParts.slice(1);
    let foundChild = this.getChild(pathPart);
    if(foundChild === undefined) {
      return undefined;
    }
    if(pathParts.length < 1) {
      return foundChild;
    }
    return foundChild.findRouteNode(pathParts);
  }

  hasRoute(pathParts: string[]): boolean {
    let pathPart = pathParts[0];
    pathParts = pathParts.slice(1);
    let foundChild = this.getChild(pathPart);
    if(foundChild === undefined) {
      return false;
    }
    if(pathParts.length < 1) {
      return true;
    }
    return foundChild.hasRoute(pathParts);
  }

  insert(pathParts: string[]): RouteNode {
    let pathPart = pathParts[0];
    pathParts = pathParts.slice(1);
    let foundChild = this.getChild(pathPart);
    if(foundChild === undefined) {
      foundChild = this.addChild(pathPart);
    }
    if(pathParts.length < 1) {
      return foundChild;
    }
    return foundChild.insert(pathParts);
  }
  private addChild(pathPart: string): RouteNode {
    let nextNode: RouteNode;
    nextNode = new RouteNode(pathPart, this);
    /*
    todo: insert sorted by route priority
    _*/
    this._children.push(nextNode);
    return nextNode;
  }

  getChild(pathPart: string): RouteNode | undefined {
    let foundChild: RouteNode | undefined;
    foundChild = this._children.find((child) => {
      return child.val === pathPart;
    });
    return foundChild;
  }

  static newRoot(): RouteNode {
    return new RouteNode(ROUTE_NODE_ROOT_VAL);
  }
}

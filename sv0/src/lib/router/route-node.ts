
const ROUTE_NODE_ROOT_VAL = '';

export class RouteNode {
  val: string;
  route: undefined | string;
  _children: RouteNode[];
  constructor(val: string) {
    this.val = val;
    this.route = undefined;
    this._children = [];
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

  insert(pathParts: string[]): void {
    if(pathParts.length < 1) {
      return;
    }
    let pathPart = pathParts[0];
    let foundChild = this.getChild(pathPart);
    if(foundChild === undefined) {
      foundChild = this.addChild(pathPart);
    }
    foundChild.insert(pathParts.slice(1));
  }
  private addChild(pathPart: string): RouteNode {
    let nextNode: RouteNode;
    nextNode = new RouteNode(pathPart);
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


import type { PathPart } from './path-util';

const PATH_NODE_ROOT_VAL: PathPart = {
  kind: 'pathname',
  val: '/',
};

export class PathNode {
  val: PathPart;
  children: PathNode[];
  _parent?: PathNode;
  constructor(val: PathPart, parent?: PathNode) {
    this.val = val;
    this.children = [];
    this._parent = parent;
  }

  insert(pathParts: PathPart[]): PathNode {
    let pathPart = pathParts[0];
    let foundChild: PathNode | undefined;
    foundChild = this.getChild(pathPart);
    if(foundChild !== undefined) {
      let invalidParam = (
        pathPart.kind === 'param'
        || pathPart.kind === 'wildcard'
      ) && foundChild.val.val !== pathPart.val;
      if(invalidParam) {
        throw new Error(`Attempt to insert pathPart ${
          pathPart.val
        } of kind '${
          pathPart.kind
        }' that already exists for node with val: ${
          foundChild.val.val
        }`);
      }
    }
    if(foundChild === undefined) {
      let nextPathPart = Object.assign({}, pathPart); // copy
      foundChild = new PathNode(nextPathPart, this);
      this.children.push(foundChild);
    }
    pathParts = pathParts.slice(1);
    if(pathParts.length < 1) {
      /* matched the last path part */
      return foundChild;
    }
    return foundChild.insert(pathParts);
  }

  getChild(pathPart: PathPart): PathNode | undefined {
    let foundChild: PathNode | undefined;
    /*
      pathname:
        1. try exact
        2. try param
        3. try wildcard
      param:
        1. match any w/ same kind
      wildcard:
        1. match any w/ same kind
    _*/
    if(
      pathPart.kind === 'param'
      || pathPart.kind === 'wildcard'
    ) {
      foundChild = this.children.find((child) => {
        return child.val.kind === pathPart.kind;
      });
    } else if(pathPart.kind === 'pathname') {
      foundChild = this.children.find((child) => {
        return child.val.val === pathPart.val;
      });
    } else {
      throw new Error(`Invalid PathPart.kind: ${pathPart.kind}`);
    }
    return foundChild;
  }

  static newRoot(): PathNode {
    return new PathNode(Object.assign({}, PATH_NODE_ROOT_VAL));
  }
}

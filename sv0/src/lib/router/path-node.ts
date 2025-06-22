
import { pathUtil, type PathPart } from './path-util';

const PATH_NODE_ROOT_VAL: PathPart = {
  kind: 'literal',
  val: '/',
};

export class PathNode {
  value: PathPart;
  children: PathNode[];
  _parent?: PathNode;
  constructor(val: PathPart, parent?: PathNode) {
    this.value = val;
    this.children = [];
    this._parent = parent;
  }

  matchPath(pathStrs: string[]): PathNode | undefined {
    /*
      Need backtracking in case an explored route is not a match, in which case
        subsequent matches will be explored at the current level by precedence.
    _*/
    if(pathStrs.length < 1) {
      return;
    }
    let currPathStr = pathStrs[0];
    let currMatch = this._match(currPathStr);
    if(!currMatch) {
      return;
    }
    if(pathStrs.length === 1) {
      return this;
    }
    let nextPathStrs = pathStrs.slice(1);
    let childMatches: PathNode[] = [];
    for(let i = 0; i < this.children.length; ++i) {
      let child = this.children[i];
      let childMatch = child.matchPath(nextPathStrs);
      if(childMatch !== undefined) {
        childMatches.push(childMatch);
      }
    }
    return childMatches[0];
  }

  /*
    Match rules / precedence:
      1. pathname
      2. param
      3. wildcard
  _*/
  private _match(pathStr: string): boolean {
    return (
      pathUtil.literalMatch(this.value, pathStr)
      || pathUtil.paramMatch(this.value, pathStr)
      || pathUtil.wildcardMatch(this.value, pathStr)
    );
  }

  insert(pathParts: PathPart[]): PathNode {
    let pathPart = pathParts[0];
    let foundChild: PathNode | undefined;
    foundChild = this.getChild(pathPart);
    if(foundChild !== undefined) {
      let invalidParam = (
        pathPart.kind === 'param'
        || pathPart.kind === 'wildcard'
      ) && foundChild.value.val !== pathPart.val;
      if(invalidParam) {
        throw new Error(`Attempt to insert pathPart ${pathPart.val} of kind '${pathPart.kind}' that already exists for node with val: ${foundChild.value.val}`);
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
    /*
    TODO: insert sorted by route priority
    _*/
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
        return child.value.kind === pathPart.kind;
      });
    } else if(pathPart.kind === 'literal') {
      foundChild = this.children.find((child) => {
        return child.value.val === pathPart.val;
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

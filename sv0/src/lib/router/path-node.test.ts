
import assert from 'node:assert';
import { describe, test, expect, beforeEach } from 'vitest';
import { PathNode } from './path-node';
import { pathUtil, type PathPart } from './path-util';

describe('path-node tests', () => {
  let rootNode: PathNode;
  const testPathnames = [
    '/test/path-a/1',
    '/test/path-b/2',
    '/test/test/path-b', // child w/ same name
    '/test2/etc',
    '/etc/1',
    '/etc/2',
    '/etc/$id',
    '/etc/$id/sub-a',
    '/etc/$id/sub-a/$',
  ];
  beforeEach(() => {
    rootNode = PathNode.newRoot();
    for(let i = 0; i < testPathnames.length; ++i) {
      let pathname = testPathnames[i];
      let pathParts = pathUtil.parsePathParts(pathname);
      if(pathParts[0].val === '/') {
        /* take root parts we're not testing for */
        pathParts = pathParts.slice(1);
      }
      rootNode.insert(pathParts);
    }
  });
  test('root node has expected number of children', () => {
    expect(rootNode.children.length).to.equal(3);
  });
  test(`doesn't throw on insert when path param matches`, () => {
    let pathname = '/etc/$id/sub-a';
    let pathParts = pathUtil.parsePathParts(pathname).slice(1);
    let inserted = rootNode.insert(pathParts);
    expect(inserted).toBeDefined();
  });
  test('throws on insert with param mismatch', () => {
    let pathParamStr = '$err';
    let pathname = `/etc/${pathParamStr}`;
    let pathParts = pathUtil.parsePathParts(pathname).slice(1);
    expect(() => {
      rootNode.insert(pathParts);
    }).to.throw(pathParamStr);
  });

  describe('matchPath()', () => {
    describe('valid exact path matches', () => {
      const exactPaths: string[] = [
        '/test/path-a/1',
        '/test/path-b/2',
        '/test/test/path-b',
        '/test2/etc',
        '/etc/1',
        '/etc/2',
      ];
      for(let i = 0; i < exactPaths.length; ++i) {
        let pathname = exactPaths[i];
        test(`${pathname}`, () => {
          let pathStrs = pathUtil.getPathStrs(pathname);
          let slug = pathStrs.at(pathStrs.length - 1);
          let matchRes = rootNode.matchPath(pathStrs);
          assert(slug !== undefined);
          expect(matchRes?.value.val).to.equal(slug);
        });
      }
    });
    describe('invalid path matches', () => {
      const invalidPaths: string[] = [
        '/err',
        '/test/path-z',
        '/test/path-a/0',
        '/test/path-a/1/err',
        '/test/path-b/2/err',
        '/test/test/path-z',
      ];
      for(let i = 0; i < invalidPaths.length; ++i) {
        let pathname = invalidPaths[i];
        test(`${pathname}`, () => {
          let pathStrs = pathUtil.getPathStrs(pathname);
          let matchRes = rootNode.matchPath(pathStrs);
          expect(matchRes, `${pathname}`).toBeUndefined();
        });
      }
    });
    describe('valid path params', () => {
      const paramPaths = [
        '/etc/3',
        '/etc/4/sub-a',
        '/etc/abc_def/sub-a',
      ];
      for(let i = 0; i < paramPaths.length; ++i) {
        let pathname = paramPaths[i];
        test(`${pathname}`, () => {
          let pathStrs = pathUtil.getPathStrs(pathname);
          let res = rootNode.matchPath(pathStrs);
          assert(res !== undefined);
          let pathParts = getPathPartsToRoot(res);
          let idPathParts = pathParts.filter(pathPart => pathPart.kind === 'param');
          expect(idPathParts).to.have.lengthOf(1);
          expect(idPathParts[0].val).to.equal('$id');
        });
      }
    });
  });
});

function getPathPartsToRoot(pathNode: PathNode): PathPart[] {
  let res: PathPart[] = [];
  let currNode: PathNode | undefined = pathNode;
  while(currNode !== undefined) {
    res.push(currNode.value);
    currNode = currNode._parent;
  }
  res.reverse();
  return res;
}

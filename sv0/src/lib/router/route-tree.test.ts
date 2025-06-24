
import { describe, test, expect, beforeEach } from 'vitest';
import { RouteTree } from './route-tree';
import type { PathNode } from './path-node';

describe('route-tree tests', () => {
  let routeTree: RouteTree;
  const testPathnames: string[] = [
    '/test',
    '/test/sub-a',
    '/test/sub-b/abc',
    '/test-2',
    '/test-2/$testParam',
    '/test-2/$testParam/detail',
  ];
  beforeEach(() => {
    routeTree = new RouteTree();
    for(let i = 0; i < testPathnames.length; ++i) {
      routeTree.insert(testPathnames[i]);
    }
  });
  describe('hasRoute()', () => {
    test('returns true for inserted routes', () => {
      for(let i = 0; i < testPathnames.length; ++i) {
        let pathname = testPathnames[i];
        let hasRoute = routeTree.hasRoute(pathname);
        expect(hasRoute).to.equal(true);
      }
    });
  });
  describe('matchPath()', () => {
    test('asdfjklj', () => {
      let pathname = '/test-2/123/detail';
      let res = routeTree.matchPath(pathname);
      expect(1).to.equal(0);
    });
  });
});

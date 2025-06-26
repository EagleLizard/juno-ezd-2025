
import assert from 'node:assert';
import { describe, test, expect, beforeEach } from 'vitest';

import { RouteTree } from './route-tree';

describe('route-tree tests', () => {
  let routeTree: RouteTree;
  const testPathnames: string[] = [
    '/test',
    '/test/sub-a',
    '/test/sub-b/abc',
    '/test-2',
    '/test-2/$testParam',
    '/test-2/$testParam/detail',
    '/etc/$p1/sub-a/$p2/sub-a2',
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
    test('route with param has param match', () => {
      let testParamVal = '123';
      let pathname = `/test-2/${testParamVal}`;
      let res = routeTree.matchPath(pathname);
      assert(res !== undefined);
      expect(res.params.get('$testParam')).to.equal(testParamVal);
    });
    test('route with param and subroute has param match', () => {
      let testParamVal = '456';
      let pathname = `/test-2/${testParamVal}/detail`;
      let res = routeTree.matchPath(pathname);
      assert(res !== undefined);
      expect(res.params.get('$testParam')).to.equal(testParamVal);
    });
    test('route with multiple params matches correct params', () => {
      let testVal1 = '222';
      let testVal2 = '11111';
      let pathname = `/etc/${testVal1}/sub-a/${testVal2}/sub-a2`;
      let res = routeTree.matchPath(pathname);
      assert(res !== undefined);
      expect(res.params.get('$p1')).to.equal(testVal1);
      expect(res.params.get('$p2')).to.equal(testVal2);
    });
    test(`pathname that isn't registered does not match`, () => {
      let pathname = '/err/path/not-exist';
      let res = routeTree.matchPath(pathname);
      expect(res).toBeUndefined();
    });
    test('partial route with params does not match', () => {
      let pathname = '/etc/1/sub-a';
      let res = routeTree.matchPath(pathname);
      expect(res).toBeUndefined();
    });
  });
});

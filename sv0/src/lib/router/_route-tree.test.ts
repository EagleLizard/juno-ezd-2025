
import { describe, test, expect, beforeEach } from 'vitest';
import { _RouteTree } from './_route-tree';

describe('route-tree tests', () => {
  let routeTree: _RouteTree;

  beforeEach(() => {
    routeTree = new _RouteTree();
  });

  test('insert route', () => {
    let route = '/etc/to/sub-a';
    let hasRoute: boolean;
    routeTree.insert(route);
    hasRoute = routeTree.hasRoute(route);
    expect(hasRoute, route).to.equal(true);
  });
  test('hasRoute returns false for subpath', () => {
    let route = '/etc/to/sub-a';
    let testRoute = '/etc/to';
    routeTree.insert(route);
    let hasRoute = routeTree.hasRoute(testRoute);
    expect(hasRoute, testRoute).toBe(false);
  });
  test('insert route throws on invalid path', () => {
    let invalidRoute = '/path/to/invalid_test';
    expect(() => {
      routeTree.insert(invalidRoute);
    }).to.throw();
  });
  test('insert route throws on duplicate route', () => {
    let testRoute = '/path/to/test';
    routeTree.insert(testRoute);
    expect(() => {
      routeTree.insert(testRoute);
    }).to.throw();
  });
});

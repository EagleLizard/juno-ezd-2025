
import { describe, test, expect, beforeEach } from 'vitest';
import { RouteTree } from './route-tree';

describe('route-tree tests', () => {
  let routeTree: RouteTree;

  beforeEach(() => {
    routeTree = new RouteTree();
  });

  test('insert route', () => {
    let route = '/etc/to/sub-a';
    let hasRoute: boolean;
    routeTree.insert(route);
    hasRoute = routeTree.hasRoute(route);
    expect(hasRoute).to.equal(true);
  });
  test('hasRoute returns false for subpath', () => {
    let route = '/etc/to/sub-a';
    let testRoute = '/etc/to';
    routeTree.insert(route);
    let hasRoute = routeTree.hasRoute(testRoute);
    expect(hasRoute).toBe(false);
  });
});

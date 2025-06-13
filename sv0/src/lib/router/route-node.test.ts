
import { describe, test, expect, beforeEach } from 'vitest';
import { RouteNode } from './route-node';
import { routeUtil } from './route-util';

describe('route-node tests', () => {
  let rootNode: RouteNode;
  beforeEach(() => {
    rootNode = RouteNode.newRoot();
  });

  describe('insert path', () => {
    let routes: string[];
    routes = [
      '/etc',
      '/etc/sub-a',
      '/etc/sub-a/1',
      '/etc/sub-b',
      '/etc/sub-b/3',
      '/etc2/path/to/thing',
    ];
    let testRoutes: string[] = [
      ...routes,
    ];
    beforeEach(() => {
      for(let i = 0; i < routes.length; i++) {
        let pathname = routes[i];
        let pathParts = routeUtil.getPathParts(pathname);
        rootNode.insert(pathParts);
      }
    });
    for(let i = 0; i < testRoutes.length; ++i) {
      let testRoute = testRoutes[i];
      test(testRoute, () => {
        let pathParts = routeUtil.getPathParts(testRoute);
        let hasRoute = rootNode.hasRoute(pathParts);
        expect(hasRoute).to.equal(true);
      });
    }
  });

  describe('does not contain unregistered routes', () => {
    let routes: string[] = [
      '/etc',
      '/etc/to/sub-a',
    ];
    let testRoutes: string[] = [
      '/etc/to/sub-b',
      '/etc/from/sub-a',
      '/etc2',
    ];
    beforeEach(() => {
      for(let i = 0; i < routes.length; ++i) {
        let pathParts = routeUtil.getPathParts(routes[i]);
        rootNode.insert(pathParts);
      }
    });
    for(let i = 0; i < testRoutes.length; ++i) {
      let testRoute = testRoutes[i];
      test(testRoute, () => {
        let pathParts = routeUtil.getPathParts(testRoute);
        let hasRoute = rootNode.hasRoute(pathParts);
        expect(hasRoute).to.equal(false);
      });
    }
  });
});

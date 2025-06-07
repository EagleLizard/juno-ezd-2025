
import { describe, test, expect } from 'vitest';
import { routeUtil } from './route-util';

describe('routeUtil tests', () => {
  describe('getPathParts tests', () => {
    test('returns expected parts from valid pathname', () => {
      let pathPartsMock: string[] = [ 'path', 'to', 'resource', '123' ];
      let pathname = `/${pathPartsMock.join('/')}`;
      let pathParts = routeUtil.getPathParts(pathname);
      expect(pathParts).not.toBe(pathPartsMock);
      expect(pathParts).toEqual(pathPartsMock);
    });

    test('ignores extra \'/\' characters from beginning/end of path', () => {
      let pathPartsMock = [ 'path', 'to', 'something' ];
      let pathname = `////${pathPartsMock.join('/')}/////`;
      let pathParts = routeUtil.getPathParts(pathname);
      expect(pathParts).toEqual(pathPartsMock);
    });
  });
});

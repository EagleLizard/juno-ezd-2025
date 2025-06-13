
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

    test('ignores extra \'/\' char from end of path', () => {
      let pathPartsMock = [ 'path', 'to', 'something' ];
      let pathname = `/${pathPartsMock.join('/')}/`;
      let pathParts = routeUtil.getPathParts(pathname);
      expect(pathParts).toEqual(pathPartsMock);
    });
  });
  describe('checkPath tests', () => {
    describe('valid pathnames', () => {
      const validPathnames: string[] = [
        '/',
        '/etc',
        '/etc/',
        '/etc/123/abc',
      ];
      for(let i = 0; i < validPathnames.length; ++i) {
        let pathname = validPathnames[i];
        test(`${pathname}`, () => {
          let isValidPath = routeUtil.checkPath(pathname);
          expect(isValidPath).to.not.equal(undefined);
        });
      }
    });
    describe('invalid pathnames', () => {
      const invalidPathnames: string[] = [
        'etc',
        'etc/123',
        '/path/to//etc',
        '/etc_123',
        '//',
        '/etc/some_thing/',
        '',
      ];
      for(let i = 0; i < invalidPathnames.length; ++i) {
        let pathname = invalidPathnames[i];
        test(`${pathname}`, () => {
          let isValidPath = routeUtil.checkPath(pathname);
          expect(isValidPath).to.equal(undefined);
        });
      }
    });
  });
});

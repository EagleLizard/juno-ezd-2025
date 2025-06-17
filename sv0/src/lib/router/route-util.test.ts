
import { describe, test, expect } from 'vitest';
import { routeUtil } from './route-util';

describe('routeUtil tests', () => {
  const INVALID_PATHNAMES: string[] = [
    'etc',
    'etc/123',
    '/path/to//etc',
    '/etc_123',
    '//',
    '/etc/some_thing/',
    '',
  ];
  describe('getPathParts()', () => {
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
  describe('checkPath()', () => {
    test('valid pathnames', () => {
      const validPathnames: string[] = [
        '/',
        '/etc',
        '/etc/',
        '/etc/123/abc',
      ];
      for(let i = 0; i < validPathnames.length; ++i) {
        let pathname = validPathnames[i];
        let isValidPath = routeUtil.checkPath(pathname);
        expect(isValidPath, pathname).to.equal(true);
      }
    });
    test('invalid pathnames', () => {
      const invalidPathnames: string[] = INVALID_PATHNAMES.slice();
      for(let i = 0; i < invalidPathnames.length; ++i) {
        let pathname = invalidPathnames[i];
        let isValidPath = routeUtil.checkPath(pathname);
        expect(isValidPath, pathname).to.equal(false);
      }
    });
  });
  describe('normalize()', () => {
    test('normalizes valid pathnames', () => {
      let testCases: [string, string][] = [
        [
          '/base',
          '/base',
        ],
        [
          '/base/',
          '/base',
        ],
        [
          '/path/to/thing',
          '/path/to/thing'
        ],
        [
          '/path/to/thing/',
          '/path/to/thing' ],
      ];
      for(let i = 0; i < testCases.length; ++i) {
        let [ testRoute, expectedVal ] = testCases[i];
        let normalized = routeUtil.normalize(testRoute);
        let msg = `${testRoute}, expected: ${expectedVal}`;
        expect(normalized, msg).to.equal(expectedVal);
      }
    });
    test('throws on invalid pathnames', () => {
      let invalidPathnames = INVALID_PATHNAMES.slice();
      for(let i = 0; i < invalidPathnames.length; ++i) {
        let invalidPathname = invalidPathnames[i];
        expect(() => {
          routeUtil.normalize(invalidPathname);
        }, invalidPathname).to.throw();
      }
    });
  });
});

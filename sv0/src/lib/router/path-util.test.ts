
import { describe, test, expect } from 'vitest';

import { pathUtil, type PathPart } from './path-util';

describe('path-util tests', () => {
  describe('parsePathname()', () => {
    const pathnameCases: [string, PathPart[]][] = [
      [ '/', [
        { kind: 'literal', val: '/' },
      ]],
      [ '/etc', [
        { kind: 'literal', val: '/' },
        { kind: 'literal', val: 'etc' },
      ]],
      [ '/etc/', [
        { kind: 'literal', val: '/' },
        { kind: 'literal', val: 'etc' },
      ]],
      [ '/etc/123/abc', [
        { kind: 'literal', val: '/' },
        { kind: 'literal', val: 'etc' },
        { kind: 'literal', val: '123' },
        { kind: 'literal', val: 'abc' },
      ]],
      [ '/etc/$aParam', [
        { kind: 'literal', val: '/' },
        { kind: 'literal', val: 'etc' },
        { kind: 'param', val: '$aParam' },
      ]],
      [ '/etc/$aParam/sub-a', [
        { kind: 'literal', val: '/' },
        { kind: 'literal', val: 'etc' },
        { kind: 'param', val: '$aParam' },
        { kind: 'literal', val: 'sub-a' },
      ]],
      [ '/etc/123/$', [
        { kind: 'literal', val: '/' },
        { kind: 'literal', val: 'etc' },
        { kind: 'literal', val: '123' },
        { kind: 'wildcard', val: '$' },
      ]],
      [ '/etc/$aParam/$', [
        { kind: 'literal', val: '/' },
        { kind: 'literal', val: 'etc' },
        { kind: 'param', val: '$aParam' },
        { kind: 'wildcard', val: '$' },
      ]],
      [ '/etc/$id/sub-a/$', [
        { kind: 'literal', val: '/' },
        { kind: 'literal', val: 'etc' },
        { kind: 'param', val: '$id' },
        { kind: 'literal', val: 'sub-a' },
        { kind: 'wildcard', val: '$' },
      ]],
    ];
    for(let i = 0; i < pathnameCases.length; ++i) {
      let [ pathname, expected ] = pathnameCases[i];
      test(`${pathname}`, () => {
        let pathParts = pathUtil.parsePathParts(pathname);
        expect(pathParts).to.deep.equal(expected);
      });
    }
  });
});

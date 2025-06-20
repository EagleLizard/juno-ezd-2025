
import { describe, test, expect } from 'vitest';

import { pathUtil, type PathPart } from './path-util';

describe('path-util tests', () => {
  describe('parsePathname()', () => {
    const pathnameCases: [string, PathPart[]][] = [
      [ '/', [
        { kind: 'pathname', val: '/' },
      ]],
      [ '/etc', [
        { kind: 'pathname', val: '/' },
        { kind: 'pathname', val: 'etc' },
      ]],
      [ '/etc/', [
        { kind: 'pathname', val: '/' },
        { kind: 'pathname', val: 'etc' },
      ]],
      [ '/etc/123/abc', [
        { kind: 'pathname', val: '/' },
        { kind: 'pathname', val: 'etc' },
        { kind: 'pathname', val: '123' },
        { kind: 'pathname', val: 'abc' },
      ]],
      [ '/etc/$aParam', [
        { kind: 'pathname', val: '/' },
        { kind: 'pathname', val: 'etc' },
        { kind: 'param', val: '$aParam' },
      ]],
      [ '/etc/$aParam/sub-a', [
        { kind: 'pathname', val: '/' },
        { kind: 'pathname', val: 'etc' },
        { kind: 'param', val: '$aParam' },
        { kind: 'pathname', val: 'sub-a' },
      ]],
      [ '/etc/123/$', [
        { kind: 'pathname', val: '/' },
        { kind: 'pathname', val: 'etc' },
        { kind: 'pathname', val: '123' },
        { kind: 'wildcard', val: '$' },
      ]],
      [ '/etc/$aParam/$', [
        { kind: 'pathname', val: '/' },
        { kind: 'pathname', val: 'etc' },
        { kind: 'param', val: '$aParam' },
        { kind: 'wildcard', val: '$' },
      ]],
      [ '/etc/$id/sub-a/$', [
        { kind: 'pathname', val: '/' },
        { kind: 'pathname', val: 'etc' },
        { kind: 'param', val: '$id' },
        { kind: 'pathname', val: 'sub-a' },
        { kind: 'wildcard', val: '$' },
      ]],
    ];
    for(let i = 0; i < pathnameCases.length; ++i) {
      let [ pathname, expected ] = pathnameCases[i];
      test(`${pathname}`, () => {
        let pathParts = pathUtil.parsePathname(pathname);
        expect(pathParts).to.deep.equal(expected);
      });
    }
  });
});

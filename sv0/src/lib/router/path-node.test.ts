
import { describe, test, expect, beforeEach } from 'vitest';
import { PathNode } from './path-node';
import { pathUtil } from './path-util';

describe('path-node tests', () => {
  let rootNode: PathNode;
  const testPathnames = [
    '/test/path-a/1',
    '/test/path-b/2',
    '/test/test/2', // child w/ same name
    '/test2/etc',
    '/etc/1',
    '/etc/2',
    '/etc/$id',
    '/etc/$id/sub-a',
  ];
  beforeEach(() => {
    rootNode = PathNode.newRoot();
    for(let i = 0; i < testPathnames.length; ++i) {
      let pathname = testPathnames[i];
      let pathParts = pathUtil.parsePathname(pathname);
      if(pathParts[0].val === '/') {
        /* take root parts we're not testing for */
        pathParts = pathParts.slice(1);
      }
      rootNode.insert(pathParts);
    }
  });
  test('root node has expected number of children', () => {
    expect(rootNode.children.length).to.equal(3);
  });
  test(`doesn't throw on insert when path param matches`, () => {
    let pathname = '/etc/$id/sub-a';
    let pathParts = pathUtil.parsePathname(pathname).slice(1);
    let inserted = rootNode.insert(pathParts);
    expect(inserted).toBeDefined();
  });
  test('throws on insert with param mismatch', () => {
    let pathParamStr = '$err';
    let pathname = `/etc/${pathParamStr}`;
    let pathParts = pathUtil.parsePathname(pathname).slice(1);
    expect(() => {
      rootNode.insert(pathParts);
    }).to.throw(pathParamStr);
  });

  describe('wildcard routes', () => {
    let wildcardPathnames = [
      '/etc/$',
      '/etc/sub-a/$',
    ];
    beforeEach(() => {
      for(let i = 0; i < wildcardPathnames.length; ++i) {
        let pathname = wildcardPathnames[i];
        let pathParts = pathUtil.parsePathname(pathname);
        if(pathParts[0].val === '/') {
          pathParts = pathParts.slice(1);
        }
        rootNode.insert(pathParts);
      }
    });

    test('wildcard has lower precedence than exact', () => {
      /* todo: implement matching */
      // console.log(rootNode.children[2].children);
    });
  });
});

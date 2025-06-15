
import { describe, test, expect, beforeEach } from 'vitest';
import { RouteNode } from './route-node';

const basePath = 'test';
const basePath2 = 'test2';
const subPathA = 'path-a';
const subPathB = 'path-b';
const subPathC = 'etc';
const pathItem1 = '1';
const pathItem2 = '2';
const subAItem1Parts = [ basePath, subPathA, pathItem1 ];
const subBItem2Parts = [ basePath, subPathB, pathItem2 ];
const subCParts = [ basePath2, subPathC ];
describe('route-node tests', () => {
  let rootNode: RouteNode;
  beforeEach(() => {
    rootNode = RouteNode.newRoot();
    rootNode.insert(subAItem1Parts);
    rootNode.insert(subBItem2Parts);
    rootNode.insert(subCParts);
  });
  test('has inserted routes', () => {
    expect(rootNode.hasRoute(subAItem1Parts)).toBe(true);
    expect(rootNode.hasRoute(subBItem2Parts)).toBe(true);
    expect(rootNode.hasRoute(subCParts)).toBe(true);
  });
  test('has inserted parent routes', () => {
    expect(rootNode.hasRoute(subAItem1Parts.slice(0, -1))).toBe(true);
    expect(rootNode.hasRoute(subAItem1Parts.slice(0, -2))).toBe(true);
    expect(rootNode.hasRoute(subCParts.slice(0, -1))).toBe(true);
  });
  test('does not have invalid routes', () => {
    expect(rootNode.hasRoute([ basePath, subPathA, pathItem2 ])).toBe(false);
    expect(rootNode.hasRoute([ basePath, subPathB, pathItem1 ])).toBe(false);
    expect(rootNode.hasRoute([ 'invalid' ])).toBe(false);
  });
});

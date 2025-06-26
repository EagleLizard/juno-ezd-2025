
import { describe, test, expect, beforeEach, vi, afterEach, afterAll, type Mock } from 'vitest';
import { EventRegistry } from '../event-registry';
import { Router } from './router';
import assert from 'node:assert';

const originalAddEventListener = globalThis.addEventListener;

describe('router tests', () => {
  let mockAddEventListener: typeof global.addEventListener<'popstate'>;
  let popStateEvtReg: EventRegistry<PopStateEvent>;
  let popStateDeregCbs: (() => void)[];
  let router: Router;
  afterAll(() => {
    globalThis.addEventListener = originalAddEventListener;
  });
  beforeEach(() => {
    popStateEvtReg = new EventRegistry();
    popStateDeregCbs = [];
    mockAddEventListener = vi.fn((
      evtName: keyof WindowEventMap,
      cb: ($e: PopStateEvent) => void
    ) => {
      assert(evtName === 'popstate');

      let deregCb = popStateEvtReg.register(cb);
      popStateDeregCbs.push(deregCb);
    });
    globalThis.addEventListener = mockAddEventListener as typeof global.addEventListener;

    router = Router.init({
      _history: globalThis.history,
      _location: globalThis.location,
    });
  });
  afterEach(() => {
    for(let i = 0; i < popStateDeregCbs.length; ++i) {
      popStateDeregCbs[i]();
    }
    popStateDeregCbs = [];
  });

  test('popstate event is registered', () => {
    let mockPopStateEvent: Partial<PopStateEvent>;
    mockPopStateEvent = {
      state: { mockStateVal: 'mock_state_val' },
    };
    popStateEvtReg.fire(mockPopStateEvent as PopStateEvent);
    expect(mockAddEventListener).toHaveBeenCalledOnce();
  });

  describe('handleAnchorClick()', () => {
    let mockEl: Partial<HTMLAnchorElement>;
    let mockMouseEvent: Partial<MouseEvent>;
    let getAttributeMock: Mock<Element['getAttribute']>;
    let preventDefaultMock: Mock<MouseEvent['preventDefault']>;
    let handleRouteChangeFn: Mock;
    beforeEach(() => {
      getAttributeMock = vi.fn();
      preventDefaultMock = vi.fn();
      mockEl = {
        getAttribute: getAttributeMock,
      };
      mockMouseEvent = {
        preventDefault: preventDefaultMock,
      };
      handleRouteChangeFn = vi.fn();
    });
    test('fires onRouteChange', () => {
      let pathname = '/path/to/something';
      getAttributeMock.mockReturnValueOnce(pathname);
      router.onRouteChange(handleRouteChangeFn);
      router.handleAnchorClick(mockEl as HTMLAnchorElement, mockMouseEvent as MouseEvent);
      expect(handleRouteChangeFn).toHaveBeenCalled();
      expect(preventDefaultMock).toHaveBeenCalled();
    });
    test('does not fire onRouteChange when href is null', () => {
      getAttributeMock.mockReturnValueOnce(null);
      router.onRouteChange(handleRouteChangeFn);
      router.handleAnchorClick(mockEl as HTMLAnchorElement, mockMouseEvent as MouseEvent);
      expect(preventDefaultMock).toHaveBeenCalled();
      expect(handleRouteChangeFn).toHaveBeenCalledTimes(0);
    });
  });
});

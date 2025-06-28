
import { describe, test, expect, beforeEach, vi, afterEach, afterAll, type Mock } from 'vitest';
import { EventRegistry } from '../event-registry';
import { RouteCtrl, type RouteChangeEvent } from './route-ctrl';
import assert from 'node:assert';

const originalAddEventListener = globalThis.addEventListener;
const originalLocation = globalThis.location;
const originalHistory = globalThis.history;

describe('route-ctrl tests', () => {
  let mockAddEventListener: typeof global.addEventListener<'popstate'>;
  let mockHistory: {
    pushState: Mock<History['pushState']>;
  };
  let popStateEvtReg: EventRegistry<PopStateEvent>;
  let popStateDeregCbs: (() => void)[];
  let routeCtrl: RouteCtrl;
  afterAll(() => {
    globalThis.addEventListener = originalAddEventListener;
    globalThis.history = originalHistory;
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
    mockHistory = {
      pushState: vi.fn(),
    };
    globalThis.addEventListener = mockAddEventListener as typeof global.addEventListener;
    globalThis.history = mockHistory as unknown as History;

    routeCtrl = RouteCtrl.init({
      /*
        todo: mock history and location
      _*/
      _history: mockHistory as unknown as History,
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
      routeCtrl.onRouteChange(handleRouteChangeFn);
      routeCtrl.handleAnchorClick(mockEl as HTMLAnchorElement, mockMouseEvent as MouseEvent);
      expect(handleRouteChangeFn).toHaveBeenCalled();
      expect(preventDefaultMock).toHaveBeenCalled();
    });
    test('calls history.pushState() with expected values', () => {
      let testCases: [ string, unknown ][] = [
        [ '/path/to/something', {
          mockStr: 'mock_state_str',
        }],
        [ '/test/sub-a', {
          val: 123,
        }],
        [ '/test-2/sub-b', undefined ],
      ];
      let expectedPushStateCalls = testCases.map((testCase) => {
        let [ pathname, state ] = testCase;
        return [ state, '', pathname ] as const;
      });
      routeCtrl.onRouteChange(handleRouteChangeFn);
      for(let i = 0; i < testCases.length; ++i) {
        let [ pathname, state ] = testCases[i];
        getAttributeMock.mockReturnValueOnce(pathname);
        routeCtrl.handleAnchorClick(mockEl as HTMLAnchorElement, mockMouseEvent as MouseEvent, state);
      }
      /* assertions */
      expect(handleRouteChangeFn).toHaveBeenCalledTimes(testCases.length);
      for(let i = 0; i < expectedPushStateCalls.length; ++i) {
        let [ state, , pathname ] = expectedPushStateCalls[i];
        let expectedEvt: RouteChangeEvent;
        expectedEvt = {
          state,
          path: pathname,
          search: '',
        };
        expect(mockHistory.pushState, pathname).toHaveBeenCalledWith(...expectedPushStateCalls[i]);
        expect(handleRouteChangeFn, pathname).toHaveBeenCalledWith(expectedEvt);
      }
    });
    test('does not fire onRouteChange when href is null', () => {
      getAttributeMock.mockReturnValueOnce(null);
      routeCtrl.onRouteChange(handleRouteChangeFn);
      routeCtrl.handleAnchorClick(mockEl as HTMLAnchorElement, mockMouseEvent as MouseEvent);
      expect(preventDefaultMock).toHaveBeenCalled();
      expect(handleRouteChangeFn).toHaveBeenCalledTimes(0);
    });
  });
});


import { EventRegistry } from '../event-registry';
import { RouteTree } from './route-tree';

type RouteCtrlCtorParams = {
  _history: History,
  _location: Location,
};

export type RouteChangeEvent = {
  state: unknown;
  path: string;
  search: string;
}

export class RouteCtrl {
  private history: History; // passing as ctor param for testing
  private location: Location; // passing as ctor param for testing
  private onRouteChangeEvtReg: EventRegistry<RouteChangeEvent>;
  routeTree: RouteTree;
  _pathname: string; // The current location pathname
  private constructor(params: RouteCtrlCtorParams) {
    this.onRouteChangeEvtReg = new EventRegistry();
    this.history = params._history;
    this.location = params._location;

    this.routeTree = new RouteTree();
    this._pathname = this.location.pathname;

    addEventListener('popstate', ($e) => {
      this.handlePopstate($e);
    });
  }

  private handlePopstate($e: PopStateEvent) {
    const state = $e.state;
    const path = this.location.pathname;
    const search = this.location.search;
    this._pathname = path;

    this.onRouteChangeEvtReg.fire({
      state,
      path,
      search,
    });
  }

  addRoute(pathname: string) {
    this.routeTree.insert(pathname);
  }

  handleAnchorClick(el: HTMLAnchorElement, $e: MouseEvent, state?: unknown) {
    let href: string | null;
    href = el.getAttribute('href');
    $e.preventDefault(); // prevent page reload
    if((typeof href) !== 'string') {
      return;
    }
    let hasMatch = this.routeTree.matchPath(href);
    if(hasMatch !== undefined) {
      console.log(hasMatch);
    }
    const nextState = state;
    const parsedHref = new URL(href, this.location.origin);
    const nextPath = parsedHref.pathname;
    const nextSearch = parsedHref.search;
    this._pathname = nextPath;

    this.history.pushState(nextState, '', href);
    this.onRouteChangeEvtReg.fire({
      state: nextState,
      path: nextPath,
      search: nextSearch,
    });
  }

  onRouteChange(fn: (evt: RouteChangeEvent) => void) {
    return this.onRouteChangeEvtReg.register(fn);
  }

  static init(params: RouteCtrlCtorParams): RouteCtrl {
    return new RouteCtrl(params);
  }
}

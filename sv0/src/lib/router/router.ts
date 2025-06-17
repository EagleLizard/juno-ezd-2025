
import { EventRegistry } from '../event-registry';

type RouterCtorParams = {
  _history: History,
  _location: Location,
};

type RouteChangeEvent = {
  state: unknown;
  path: string;
  search: string;
}

export class Router {
  private history: History; // passing as ctor param for testing
  private location: Location; // passing as ctor param for testing
  private onRouteChangeEvtReg: EventRegistry<RouteChangeEvent>;
  _pathname: string; // The current location pathname
  private constructor(params: RouterCtorParams) {
    this.onRouteChangeEvtReg = new EventRegistry();
    this.history = params._history;
    this.location = params._location;

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

  handleAnchorClick(el: HTMLAnchorElement, $e: MouseEvent) {
    let href: string | null;
    href = el.getAttribute('href');
    $e.preventDefault(); // prevent page reload
    if(href === null) {
      return;
    }
    const nextState = {};
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

  static init(params: RouterCtorParams): Router {
    return new Router(params);
  }
}

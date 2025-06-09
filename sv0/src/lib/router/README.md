
# Router

Minimal SPA (single-page-app) router

## [WIP] Development / Design

Goals:
1. Framework-agnostic
2. Can subscribe to route changes
3. Route matching
4. Minimal parameter syntax
5.

Non-goals:
1. SSR (server-side-rendering)
    1. It's a frontend router
2. Performance
    1. nice-to-have, but non-critical (unlike a server router)
3.

## [WIP] Route Matching

Route matching could be done statically or against a list of routes registered with the router.

```ts
/* static */
routesMatch(route1: string, route2: string): boolean
```

When matching against registered routes, multiple matches may exist. This should be handled by priority.

So if matching route `/path/to/abc/etc` and the registered routes:
```
1. /path/to/:param1/etc
2. /path/to/abc/etc
3. /path/to/abc
```
The path would match in the following order: `2, 1, 3`:
- 2: exact match, literal
- 1: exact match, with parameter
- 3: partial match, literal

### Approach 1: Route Matching is a Tree

When a route is registered in the router, its path segments are split and added to a tree for matching.

When checking if a path matches, it will check each segment of the path being checked from left to right, descending into child nodes if a matching entry exists.
An entry will match:
1. Exactly if an exact match exists
2. A route param if a registered route param exists

For example if the following routes are registered:
```
1: /etc/specific
2: /etc/$id
3: /etc/$id/sub
```

The table below shows how different paths will resolve:

|path|resolved|params|
|-|-|-|
|`/etc/specific`|`/etc/specific`|n/a|
|`/etc/123`|`/etc/$id`|`id='123'`|
|`/etc/123/sub`|`/etc/$id/sub`|`id='123'`|
|`/etc/specific/sub`|n/a|n/a|

For the example `/etc/specific/sub`, no route is found because the node at `etc -> specific` exists and has no child paths. This may not be desired behavior, it may be preferred to backtrack if finding a subroute fails.

In that case, it could walk back until another match can be applied (by precedence), and descend into that branch.

## Route Change Events

Route change events can be subscribed to on a router instance:

```ts
let deregCb = router.onRouteChange((event) => {
  /* ... */
});
```

The register function returns a callback to unregister, which should be called when no longer needed.

In a framework you would call this when a component is destroyed / unmounted.

React:
```tsx
useEffect(() => {
  const deregCb = router.onRouteChange((event) => {
    /* ... */
  });
  return () => {
    deregCb();
  };
}, []);
```

Svelte:
```ts
  onMount(() => {
    const deregCb = router.onRouteChange((event) => {
      /* ... */
    });
    return () => {
      deregCb();
    };
  });
```

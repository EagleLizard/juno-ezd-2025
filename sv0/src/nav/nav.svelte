
<script lang="ts">
  import { Router } from '../lib/router/router';
  import { routeUtil } from '../lib/router/route-util';

  type NavProps = {
    router: Router;
  };
  // history.pushState({}, '', '/etc');
  type NavMenuItem = {
    key: string;
    label: string;
    path: string;
  };
  const navMenuItems: NavMenuItem[] = [
    {
      key: 'home',
      label: 'home',
      path: '',
    },
    {
      key: 'etc',
      label: 'etc',
      path: 'etc',
    },
    {
      key: 'etc_sub1',
      label: 'etc/sub1',
      path: 'etc/sub1',
    },
    {
      key: 'page',
      label: 'page',
      path: 'page',
    },
    {
      key: 'about',
      label: 'about',
      path: 'about',
    },
  ];
  let props: NavProps = $props();
  // let currPath = $state<string>(props.router._pathname);
  let currPath = $state<string>(props.router._pathname);
  let basePathSlug = $state<string>();

  props.router.onRouteChange(evt => {
    currPath = evt.path;
  });

  $effect(() => {
    if(currPath === undefined) {
      return;
    }
    let pathParts = routeUtil.getPathParts(currPath);
    basePathSlug = pathParts[0];
  });

</script>

<div class="nav">
  <div>
    nav
  </div>
  <div class="nav-items">
    {#each navMenuItems as navMenuItem (navMenuItem.key)}
      <a
        href={`/${navMenuItem.path}`}
        class="nav-item-link {navMenuItem.path === basePathSlug ? 'selected' : '' }"
        onclick={function ($e) {
          props.router.handleAnchorClick($e.currentTarget, $e);
        }}
      >
        <div class="nav-item">
          {navMenuItem.label}
        </div>
        <div class="highlight-bar"></div>
      </a>
    {/each}
  </div>
  <div>
    <code>router.pathname</code>: <code>{props.router._pathname}</code>
    <br/>
    currPath: <code>{currPath}</code>
    <br/>
    slug: <code>{basePathSlug}</code>
  </div>
</div>

<style>
  @import './nav.css';
</style>

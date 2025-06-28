<script lang="ts">
  import { onMount } from 'svelte';
  import Nav from './nav/nav.svelte';
  import { RouteCtrl } from './lib/router/route-ctrl';
  import TestList from './test-list/test-list.svelte';

  const router = $state(RouteCtrl.init({
    _history: window.history,
    _location: window.location,
  }));

  onMount(init);

  function init() {
    initializeRouter();
  }

  function initializeRouter() {
    router.addRoute('/etc');
    // router.addRoute('err*');
  }

</script>

<main class="sv0-main">
  <h1>sv0</h1>
  <Nav router={router}/>
  <TestList/>
</main>

<style>
  @import './sv0-app.css';
</style>

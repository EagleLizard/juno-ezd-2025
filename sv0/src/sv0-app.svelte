<script lang="ts">
  import { onMount } from 'svelte';
  import Nav from './nav/nav.svelte';
  import { Router } from './lib/router/router';

  type TestListItem = {
    id: string;
    label: string;
  };

  const router = $state(Router.init({
    _history: window.history,
    _location: window.location,
  }));
  let testListItems: TestListItem[] = $state([]);
  let idCounter = $state(0);
  let listItemIncBy = $state(1);

  onMount(init);

  function init() {
    for(let i = 0; i < 40; ++i) {
      pushListItem();
    }
  }

  function handleAddListItem($e: MouseEvent) {
    for(let i = 0; i < listItemIncBy; ++i) {
      pushListItem();
    }
  }

  function pushListItem() {
    let currId = idCounter;
    let id = `${currId}`;
    testListItems.push({
      id,
      label: currId.toString(16)
    });
    idCounter += 1;
  }

</script>

<main class="sv0-main">
  <h1>sv0</h1>
  <Nav router={router}/>
  <div>
    <hr/>
    <div class="test-list-buttons">
      <button onclick={handleAddListItem}>
        add
      </button>
      <input type="number" value={listItemIncBy} min=0 onchange={function ($e) {
        const valStr = this.value;
        if(!isNaN(+valStr)) {
          listItemIncBy = +valStr;
        }
      }}/>
      <div>
        numItems: <code>{testListItems.length}</code>
      </div>
    </div>

    <div>
      list
    </div>
    <div class="test-list-items">
      {#each testListItems as testListItem (testListItem.id)}
        <div class="test-list-item">
          {testListItem.label}
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  @import './sv0-app.css';
</style>

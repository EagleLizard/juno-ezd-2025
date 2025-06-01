
import { useEffect, useState, type ChangeEvent, type MouseEvent } from 'react';
import './re0-app.css';

type TestListItem = {
  id: string;
  label: string;
};

/*
This gets reset when react/vite HMR happens...
_*/
let testListItemIdCounter = 0;

export function Re0App() {
  const [ initialized, setInitialized ] = useState(false);
  const [ testListItems, setTestListItems ] = useState<TestListItem[]>([]);
  const [ listItemIncBy, setListItemIncBy ] = useState(1);
  // const [ count, setCount ] = useState(0);

  useEffect(() => {
    init();
  }, []);
  init();

  return (
    <div className="re0-app">
      <h1>re0</h1>
      <div className="test-list-buttons">
        <button onClick={handAddClick}>
          add
        </button>
        <input
          type="number"
          min="0"
          defaultValue={listItemIncBy}
          onChange={handleInputChange}
        />
      </div>
      <div className="test-list-items">
        {testListItems.map(testListItem => {
          return (
            <div className="test-list-item" key={testListItem.id}>
              {testListItem.label}
            </div>
          );
        })}
      </div>
    </div>
  );

  function handAddClick($e: MouseEvent) {
    let nextTestListItems = [
      ...testListItems,
    ];
    for(let i = 0; i < listItemIncBy; ++i) {
      nextTestListItems.push(createTestListItem());
    }
    setTestListItems(nextTestListItems);
  }

  function handleInputChange($e: ChangeEvent<HTMLInputElement>) {
    let valStr = $e.target.value;
    if(!isNaN(+valStr)) {
      setListItemIncBy(+valStr);
    }
  }
  
  function init() {
    if(initialized) {
      return;
    }
    setInitialized(true);
    let nextTestListItems = [
      ...testListItems,
    ];
    for(let i = 0; i < 40; ++i) {
      nextTestListItems.push(createTestListItem());
    }
    setTestListItems(nextTestListItems);
  }
}

function createTestListItem() {
  let currId = testListItemIdCounter++;
  let nextTestListItem: TestListItem = {
    id: `${currId}`,
    label: currId.toString(36),
  };
  return nextTestListItem;
}

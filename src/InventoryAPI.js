import { getCookieByName } from './utils.js';
import { fetchRetry } from './Authentication.js';

export async function CreateInventory(inventory, inventories, setInventories) {
  /* Creates a new inventory */
  const originalFetch = (onError) => {
    fetch(
      process.env.REACT_APP_API + 'inventories',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookieByName("bearerToken")
        },
        body: JSON.stringify({
          inventory
        }.inventory)
      }
    ).then(async (response) => {
      if (response.status === 201) {
        setInventories([...inventories, await response.json()]);
      } else if (response.status === 401) {
        console.log(response);
      }
    }).catch(onError);
  }
  fetchRetry(originalFetch);
}

export async function DeleteInventory(inventoryId, inventories, setInventories) {
  const originalFetch = (onError) => 
  {
      fetch(
        process.env.REACT_APP_API + 'inventories/' + inventoryId,
      {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookieByName("bearerToken")
        }
      }
    ).then(async (response) => {
      if (response.status === 204) {
        let newInventories = inventories;
        var removeIndex = newInventories.map(inventory => inventory.id).indexOf(inventoryId);
        newInventories.splice(removeIndex, 1);
        setInventories([...newInventories]);
      }
    }).catch(onError);
  }
  fetchRetry(originalFetch);
}

export async function GetInventories(setInventories) {
  /* Fetches and sets all inventories owned by the current user. */
  const originalFetch = (onError) => {
    fetch(
      process.env.REACT_APP_API + 'inventories',
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookieByName("bearerToken")
        },
      }
    ).then(async (response) => {
      if (response.status === 200) {
        setInventories(await response.json());
      }
    }).catch(onError);
  }
  fetchRetry(originalFetch);
}

export async function GetInventory(inventoryId, setInventory) {
  /* Fetches and sets the details of the inventory specified by inventoryId. */
  const originalFetch = (onError) => {
    fetch(
      process.env.REACT_APP_API + 'inventories/' + inventoryId,
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookieByName("bearerToken")
        },
      }
    ).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        setInventory(data);
      }
    }).catch(onError);
  }
  fetchRetry(originalFetch);
}

export async function GetInventoryContents(inventoryId, setItems) {
  /* Fetches and sets the details of all items in the inventory specified by inventoryId. */
  const originalFetch = (onError) => {
    fetch(
      process.env.REACT_APP_API + 'inventories/' + inventoryId + "/contents/",
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookieByName("bearerToken")
        }
      }
    ).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        setItems(data);
      }
    }).catch(onError);
  }
  fetchRetry(originalFetch);
}

export async function DeleteItem(itemId, items, setItems) {
  /* Deletes the item indicated by the itemId. */
  const originalFetch = (onError) => {
    fetch(
      process.env.REACT_APP_API + 'inventoryitems/' + itemId,
      {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookieByName("bearerToken")
        }
      }
    ).then(async (response) => {
      if (response.status === 204) {
        let newItems = items;
        var removeIndex = newItems.map(item => item.id).indexOf(itemId);
        newItems.splice(removeIndex, 1);
        setItems([...newItems]);
      }
    }).catch(onError);
  }
  fetchRetry(originalFetch);
}

export async function CreateItem(item, items, setItems) {
  /* Creates an item based on the JSON representation item. */
  const originalFetch = (onError) => {
    fetch(
      process.env.REACT_APP_API + 'inventoryitems',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookieByName("bearerToken")
        },
        body: JSON.stringify({
          item
        }.item)
      }
    ).then(async (response) => {
      if (response.status === 201) {
        setItems([...items, await response.json()]);
      }
    }).catch(onError);
  }
  fetchRetry(originalFetch);
}

export async function UpdateItem(item, onSuccess) {
  /* PUTS the item to submit changes. */
  const originalFetch = (onError) => {
    fetch(
      process.env.REACT_APP_API + 'inventoryitems/' + item.id,
      {
        method: "PUT",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getCookieByName("bearerToken")
        },
        body: JSON.stringify({
          item
        }.item)
      }
    ).then(async (response) => {
      if (response.status === 204) {
        onSuccess();
      }
    }).catch(onError);
  }
  fetchRetry(originalFetch);
}

export async function MoveItem(item, newInventoryId, items, setItems) {
  /* A wrapper for UpdateItem that moves the indicated item to a new location. */
    if (newInventoryId === "") {
      return;
    }
    item.inventoryId = newInventoryId;

    const onSuccess = async () => {
      let newItems = items;
      var removeIndex = newItems.map(item => item.id).indexOf(item.id);
      newItems.splice(removeIndex, 1);
      setItems([...newItems]);
    };

    UpdateItem(item, onSuccess);
}
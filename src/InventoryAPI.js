import { db } from './db.js';

export async function CreateInventory(context, inventory, inventories, setInventories) {
  /* Creates a new inventory */
  const id = await db.inventories.add(inventory);
  setInventories([...inventories, await db.inventories.get(id)]);
  await db.history.add({
    'userId': context.user.id,
    'action': 'CreateInventory',
    'data': inventory,
    'ts': Date.now()
  })
  /*const originalFetch = (onError) => {
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
  fetchRetry(originalFetch);*/
}

export async function DeleteInventory(context, inventory, inventories, setInventories) {
  // Delete contained items first
  const originalInventory = await db.inventories.get(parseInt(inventory.id));
  const originalItems = await db.items.where({inventoryId: parseInt(inventory.id)}).toArray();
  db.items.bulkDelete(originalItems.map((item) => {return item.id}));
  originalItems.forEach( async (item) => {
    await db.history.add({
      'userId': context.user.id,
      'action': 'DeleteItem',
      'data': item,
      'ts': Date.now()
    });
  });

  await db.inventories.where(
    {
      ownerId: context.user.id,
      id: inventory.id
    }
  ).delete();
  await db.history.add({
    'userId': context.user.id,
    'action': 'DeleteInventory',
    'data': {
      'inventory': originalInventory,
      'items': originalItems
    },
    'ts': Date.now()
  });
  let newInventories = inventories;
  var removeIndex = newInventories.map(newInventory => newInventory.id).indexOf(inventory.id);
  newInventories.splice(removeIndex, 1);
  setInventories([...newInventories]);
  /*const originalFetch = (onError) => 
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
  fetchRetry(originalFetch);*/
}

export async function GetInventories(context, setInventories) {
  /* Fetches and sets all inventories owned by the current user. */
  // If local user, just check local db
  // If not local user, just check local db
  //   TODO check remote to and sync eventually

  setInventories(await db.inventories.where({ownerId: context.user.id}).toArray() ?? []);

  /*const originalFetch = (onError) => {
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
  fetchRetry(originalFetch);*/
}

export async function GetInventory(inventoryId, setInventory) {
  /* Fetches and sets the details of the inventory specified by inventoryId. */
  setInventory(await db.inventories.get({id: parseInt(inventoryId)}));
  /*const originalFetch = (onError) => {
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
  fetchRetry(originalFetch);*/
}

export async function GetInventoryContents(inventoryId, setItems) {
  /* Fetches and sets the details of all items in the inventory specified by inventoryId. */
  setItems(await db.items.where({inventoryId: parseInt(inventoryId)}).toArray() ?? []);
  // const originalFetch = (onError) => {
  //   fetch(
  //     process.env.REACT_APP_API + 'inventories/' + inventoryId + "/contents/",
  //     {
  //       method: "GET",
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + getCookieByName("bearerToken")
  //       }
  //     }
  //   ).then(async (response) => {
  //     if (response.status === 200) {
  //       const data = await response.json();
  //       setItems(data);
  //     }
  //   }).catch(onError);
  // }
  // fetchRetry(originalFetch);
}

export async function DeleteItem(context, item, items, setItems) {
  /* Deletes the item indicated by the itemId. */
  await db.items.where({id: parseInt(item.id)}).delete();
  let newItems = items;
  var removeIndex = newItems.map(newItem => newItem.id).indexOf(item.id);
  newItems.splice(removeIndex, 1);
  setItems([...newItems]);
  db.history.add({
    'userId':  context.user.id,
    'action': 'DeleteItem',
    'data': item,
    'ts': Date.now()
  });
  /* const originalFetch = (onError) => {
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
  fetchRetry(originalFetch);*/
}

export async function CreateItem(context, item, items, setItems) {
  /* Creates an item based on the JSON representation item. */
  const id = await db.items.add(item);
  setItems([...items, await db.items.get(id)]);
  await db.history.add({
    'userId': context.user.id,
    'action': 'CreateItem',
    'data': item,
    'ts': Date.now()
  });
  /*const originalFetch = (onError) => {
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
  fetchRetry(originalFetch);*/
}

export async function UpdateItem(context, item, onSuccess) {
  /* PUTS the item to submit changes. */
  const originalItem = await db.items.get(item.id);
  db.items.update(item.id, item);
  onSuccess();
  await db.history.add({
    'userId': context.user.id,
    'action': 'UpdateItem',
    'data': item,
    'original': originalItem,
    'ts': Date.now()
  });
  /*const originalFetch = (onError) => {
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
  fetchRetry(originalFetch);*/
}

export async function MoveItem(context, item, newInventoryId, items, setItems) {
  /* A wrapper for UpdateItem that moves the indicated item to a new location. */
  if (newInventoryId === "") {
    return;
  }
  item.inventoryId = parseInt(newInventoryId);

  const onSuccess = async () => {
    let newItems = items;
    var removeIndex = newItems.map(item => item.id).indexOf(item.id);
    newItems.splice(removeIndex, 1);
    setItems([...newItems]);
  };

  UpdateItem(context, item, onSuccess);
}

export async function Undo(context) {
  const history = await db.history.where({userId: context.user.id}).last();

  if (history === undefined) { return; }

  console.log(history);

  switch(history.action) {
    case "CreateItem":
      await db.items.where({id: history.data.id}).delete();
      break;
    case "UpdateItem":
      await db.items.update(history.data.id, history.original);
      break;
    case "DeleteItem":
      await db.items.add(history.data);
      break;
    case "CreateInventory":
      await db.inventories.where({id: history.data.id}).delete();
      break;
    case "DeleteInventory":
      await db.inventories.add(history.data.inventory);
      history.data.items.forEach( async (item) => {
        console.log(item);  
        await db.items.add(item);
      });
      break;
    default:
      break;
  }

  await db.history.where({id: history.id}).delete();

}
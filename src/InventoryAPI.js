export async function IsOnline(bearerToken, setOnline) {
  /* Determines if the app can communicate with the server. */
  fetch(
    'http://192.168.1.10/api/inventories',
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + bearerToken
      }
    }
  ).then(async (response) => {
    if (response.status === 200) {
      setOnline(true);
    }
  }).catch(() => {
    setOnline(false);
  });
}

export async function CreateInventory(bearerToken, inventory, inventories, setInventories) {
  /* Creates a new inventory */
  fetch(
    'http://192.168.1.10/api/inventories',
    {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + bearerToken
      },
      body: JSON.stringify({
        inventory
      }.inventory)
    }
  ).then(async (response) => {
    if (response.status === 201) {
      setInventories([...inventories, await response.json()]);
    }
  });
}

export async function DeleteInventory(bearerToken, inventoryId, inventories, setInventories) {
  fetch(
    'http://192.168.1.10/api/inventories/' + inventoryId,
    {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + bearerToken
      }
    }
  ).then(async (response) => {
    if (response.status === 204) {
      let newInventories = inventories;
      var removeIndex = newInventories.map(inventory => inventory.id).indexOf(inventoryId);
      newInventories.splice(removeIndex, 1);
      setInventories([...newInventories]);
    }
  });
}

export async function GetInventories(bearerToken, setInventories) {
  /* Fetches and sets all inventories owned by the current user. */
  fetch(
    'http://192.168.1.10/api/inventories',
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + bearerToken
      }
    }
  ).then(async (response) => {
    if (response.status === 200) {
      setInventories(await response.json());
    }
  });
}

export async function GetInventory(bearerToken, inventoryId, setInventory) {
  /* Fetches and sets the details of the inventory specified by inventoryId. */
  fetch(
    'http://192.168.1.10/api/inventories/' + inventoryId,
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + bearerToken
      }
    }
  ).then(async (response) => {
    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      setInventory(data);
    }
  });
}

export async function GetInventoryContents(bearerToken, inventoryId, setItems) {
  /* Fetches and sets the details of all items in the inventory specified by inventoryId. */
    fetch(
      'http://192.168.1.10/api/inventories/' + inventoryId + "/contents/",
      {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + bearerToken
        }
      }
    ).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        setItems(data);
      }
    });

}

export async function DeleteItem(bearerToken, itemId, items, setItems) {
  /* Deletes the item indicated by the itemId. */
    fetch(
      'http://192.168.1.10/api/inventoryitems/' + itemId,
      {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + bearerToken
        }
      }
    ).then(async (response) => {
      if (response.status === 204) {
        let newItems = items;
        var removeIndex = newItems.map(item => item.id).indexOf(itemId);
        newItems.splice(removeIndex, 1);
        setItems([...newItems]);
      }
    });
}

export async function CreateItem(bearerToken, item, items, setItems) {
  /* Creates an item based on the JSON representation item. */
    fetch(
      'http://192.168.1.10/api/inventoryitems',
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + bearerToken
        },
        body: JSON.stringify({
          item
        }.item)
      }
    ).then(async (response) => {
      if (response.status === 201) {
        setItems([...items, await response.json()]);
      }
    });
}

export async function UpdateItem(bearerToken, item, onSuccess) {
  /* PUTS the item to submit changes. */
  fetch(
    'http://192.168.1.10/api/inventoryitems/' + item.id,
    {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + bearerToken
      },
      body: JSON.stringify({
        item
      }.item)
    }
  ).then(async (response) => {
    if (response.status === 204) {
      onSuccess();
    }
  });
}

export async function MoveItem(bearerToken, item, newInventoryId, items, setItems) {
  /* Moves the indicated item to the new location. */
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

    UpdateItem(bearerToken, item, onSuccess);
}
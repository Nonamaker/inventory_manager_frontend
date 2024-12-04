import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
    users: '++id',
    inventories: '++id, ownerId',
    items: '++id, inventoryId'
});

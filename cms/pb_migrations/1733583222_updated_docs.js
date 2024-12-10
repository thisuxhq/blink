/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n9aqwacwoy4stzs")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xdwxo0if",
    "name": "published",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n9aqwacwoy4stzs")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xdwxo0if",
    "name": "status",
    "type": "bool",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
})

/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n9aqwacwoy4stzs")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "slqrtrqd",
    "name": "category",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "Getting Started",
        "Features",
        "API Documentation",
        "Troubleshooting",
        "FAQs"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("n9aqwacwoy4stzs")

  // remove
  collection.schema.removeField("slqrtrqd")

  return dao.saveCollection(collection)
})

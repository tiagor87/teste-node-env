if (!/production/i.test(process.env.NODE_ENV)) {
  require('dotenv').config();
}
const mongoose = require('mongoose');

const db = mongoose.createConnection(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env
    .DB_NAME}`
);

const itemSchema = new mongoose.Schema({
  product: String,
  quantity: Number,
  value: Number
});

const Item = db.model('Item', itemSchema, 'items');

const documentSchema = new mongoose.Schema({
  operation: { type: String, enum: ['in', 'out'] },
  items: [{ type: 'Item', lazy: true }]
});

const Document = db.model('Document', documentSchema, 'documents');
let document = new Document();
document.operation = 'out';
const item = new Item({
  product: 'product',
  quantity: 1,
  value: 100
});
document.items.push(item);
return document
  .save()
  .then(response => console.log(response))
  .catch(error => console.log(error));

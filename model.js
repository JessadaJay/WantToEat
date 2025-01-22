const mongoose = require('mongoose');

async function connectDatabases() {
  try {
    const dbUrl = 'mongodb://localhost:27017/productDB';
    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB successfully!");

    const orderDbConnection = mongoose.createConnection('mongodb://localhost/orderDb');
    orderDbConnection.on('open', () => {
      console.log('Connected to orderDb');
    });

  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
}

connectDatabases();

//ProductModel
let productSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});
const Product = mongoose.model("Product", productSchema);
let saveProduct = async (product) => {
  try {
    await product.save();
  } catch (err) {
    throw err;
  }
};
// TableModel
// let tableSchema = new mongoose.Schema({
//   table: Number,
// });
// const Table = mongoose.model("table", tableSchema);
// let saveTable = async (table) => {
//   try {
//     await table.save();
//   } catch (err) {
//     throw err;
//   }
// };

//OrderModel
let orderSchema = new mongoose.Schema({
  table: Number,
  listFood: [String],
  status: String
});
const Order = mongoose.model("order", orderSchema);
let saveOrder = async (order) => {
  try {
    await order.save();
  } catch (err) {
    throw err;
  }
};

//RegisterModel
let registerSchema = new mongoose.Schema({
  name: String,
  nickname: String,
  birthday: Date,
  position: String,
  Username: String,
  Password: String
});
const Register = mongoose.model("register", registerSchema);
let saveRegister = async (register) => {
  try {
    await register.save();
  } catch (err) {
    throw err;
  }
};
module.exports = { Product, saveProduct, Register, saveRegister , Order , saveOrder };
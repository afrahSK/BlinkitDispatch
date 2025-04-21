const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: {
    name: String,
    house: String,
    floor: String,
    area: String,
    phone: String,
    lat: Number,  
    lng: Number
  },
//   cart is an array of objects
// each object will be representing one product
cart: [
    {
      id: String,           // product ID from your JSON
      name: String,
      price: Number,
      image: String,
      quantity: Number
    }
  ]
});

module.exports = mongoose.model('User', userSchema);

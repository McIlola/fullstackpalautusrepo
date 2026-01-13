const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const numValidator = (number) => {
  const parts = number.split('-');
  if (parts.length !== 2) {
    return false;
  }
  const firstPart = parts[0]
  const secondPart = parts[1]

  if (!(firstPart.length === 2 || firstPart.length === 3)) { 
    return false;
  }

  if (!/^\d+$/.test(firstPart) || !/^\d+$/.test(secondPart)) {
    return false;
  }
  return number.length >= 8;
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'User name required']
  },
  number: {
    type: String,
    required: [true, 'User phone number required'],
    validate: {
      validator: numValidator,
      message: props => `${props.value} is not a valid phone number!`
    }
  }
  
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
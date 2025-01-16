module.exports = {
    validateContact: function (value) {
      return /^[0-9]{10}$/.test(value);
    },
    
    validateEmail: function (value) {
      return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value);
    },
    
    validateDate: function (value) {
      return value instanceof Date && !isNaN(value);
    }
  };
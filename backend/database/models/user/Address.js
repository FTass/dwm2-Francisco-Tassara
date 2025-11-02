const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({ 
    street :{ type: String, required : true},
    number: { type: String, required : true},
    apt: String,
    commune: { type: String, required : true},
    city: { type: String, required : true},
    isDefault: Boolean,
    createdAt : { type: Date, default: Date.now },
    userId: {type: mongoose.Schema.ObjectId, ref: 'user', required : true},
    
});

addressSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'firstName -profile' // 👈 muestra sólo el nombre
  });
  next();
});



module.exports = mongoose.model('address', addressSchema);
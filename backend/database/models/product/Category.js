const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    name : {type : String , required: true},
    slug : {type : String , required : true, unique : true},
    description : {type: String , required: true},
    parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',  
    default: null    
    },
    createdAt: Date

});

module.exports = mongoose.model('category', categorySchema);
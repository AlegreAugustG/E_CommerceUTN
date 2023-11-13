const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const comentsSchema=new Schema({
    titulo:{
        type:String,
        required:true
    },
    texto:{
        type:String,
        required:true
    },
    fechaCreaion:{
        type:Date,
        default:Date.now
    },
    fechaActualizacion:{
        type:Date,
        default:Date.now
    },
})

module.exports=mongoose.model('Coments',comentsSchema)
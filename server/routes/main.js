const express = require('express');
const router = express.Router();
 


 

router.get('/about',(req,res)=>{
    let nombre = 'lucia'
    // res.send('<h1>hola mundo</h1>')
    res.render('about',{nombre})
})

module.exports=router
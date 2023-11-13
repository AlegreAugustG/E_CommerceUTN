const express = require('express');
const expressLayout = require('express-ejs-layouts');
require('dotenv').config();
const connectDb=require('./server/config/connectDb')

const app = express();

const PORT = process.env.PORT || 3500;

connectDb()

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(express.static('public'))

 
app.set('view engine','ejs')
app.get('/', (req, res) => {
    res.render('index');
  });
app.use('/',require('./server/routes/main'))
app.use('/',require('./server/routes/product'))
app.use('/',require('./server/routes/cart'))


app.listen(PORT,()=>{
    console.log('se conecto el servidor')
})
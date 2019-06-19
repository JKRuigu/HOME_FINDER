const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine','ejs');

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//ROUTES
app.get('/',(req,res)=>{
	res.render('index')
});

app.get('/select',(req,res)=>{
	res.render('select')
});

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`)});
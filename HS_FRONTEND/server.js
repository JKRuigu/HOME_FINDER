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
//HOMEPAGE
app.get('/',(req,res)=>{
	res.render('index', {
        display: true
    })
});

//SELECT PAGE
app.get('/select',(req,res)=>{
	res.render('select', {
        display: false
    })
});

//ABOUT US
app.get('/about',(req,res)=>{
	res.render('about', {
        display: false
    })
});

//CONTACT US
app.get('/contact',(req,res)=>{
	res.render('contact', {
        display: false
    })
});

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{console.log(`Server running on port ${PORT}`)});
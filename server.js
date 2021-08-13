const path = require('path');
const express = require('express');
const handlebars = require('handlebars');
const moment = require('moment'); 
moment().format();
const exphbs= require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const flash = require('connect-flash');
const db  = require('./models/db');

//Connecting to Sqlite Database via Sequelizer
try {
  db.sequelize.sync();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

//Start Express Server
const app = express();
const PORT = process.env.PORT || 3000;

//Static Files  Directory Path
const publicDirectoryPath = path.join(__dirname, '/public');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors());

app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Configuring Views engine
app.set('views', path.join(__dirname,'/views/'));

app.engine('hbs', exphbs({
    defaultLayout: 'main', 
    layoutsDir:__dirname + '/views/layouts',
    extname:'hbs',
    handlebars:allowInsecurePrototypeAccess(handlebars),
    helpers:{
    // Function to do basic mathematical operation in handlebar
      math: function(lvalue, operator, rvalue) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
      return {
          "+": lvalue + rvalue,
          "-": lvalue - rvalue,
          "*": lvalue * rvalue,
          "/": lvalue / rvalue,
          "%": lvalue % rvalue
      }[operator];
    },
    formatTime : function(date,format){
      var mmnt = moment(date);
      return mmnt.format(format);
    },
    currencyFormat: function(number){
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
}
}));
app.set('view engine', 'hbs');
app.use(express.static(publicDirectoryPath));
//Routes
app.use('/dashboard', require('./controllers/dashboardController'));
app.use('/deals', require('./controllers/dealsController'));
app.use('/product', require('./controllers/productController'));
app.use('/', require('./controllers/userController'));
app.use('/warehouse', require('./controllers/warehouseController'));
app.use('/client', require('./controllers/clientController'));


app.listen(PORT,()=>{
    console.log(`Express server started at port : ${PORT}` );
});



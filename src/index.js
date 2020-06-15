const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

//settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use(require('./routes/rutas'));

//StaticFiles
app.use(express.static(path.join(__dirname,'public')))

app.listen(app.get('port'),()=>{
  console.log(`server on port ${app.get('port')}`)
}

);

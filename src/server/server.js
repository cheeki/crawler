import apiRoutes from './routes/index';

var express = require('express');
var path = require('path');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var helmet = require('helmet');
var config = require('../../config/config.js');
var dbConfig = require('../../config/db.json')[process.env.NODE_ENV];

var routes = require('./routes/index');

var logger = require('../service/logger').logger;
var db = require('../service/db.js');

var app = express();
var viewDir = '../views';
var publicDir = '../public';

// view engine setup
app.set('views', path.join(__dirname, viewDir));
// app.engine('hbs', exphbs({
//     extname: 'hbs',
//     defaultLayout: 'main.hbs',
//     layoutsDir: path.join(__dirname, viewDir + '/layouts')
// }));

app.engine('html', require('ejs').renderFile);

// app.set('view engine', 'hbs');

app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(helmet());
// app.use(morgan('combined', {
//     stream: logger.stream
// }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, publicDir)));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.disable('x-powered-by');
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//production error handler
//no stacktraces leaked to user
app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.listen(process.env.PORT || 8080, () => {
    console.log('Listening on port ' + (process.env.PORT || 8080));
});

module.exports = app;

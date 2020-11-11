const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const app = express();
const dishRouter = require("./routes/dishRouter");
const promoRouter = require("./routes/promoRouter");
const leaderRouter = require("./routes/leaderRouter");
const uploadRouter = require('./routes/uploadRouter');
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const passport = require('passport');
const authenticate = require('./authenticate');
const config = require('./config');

const mongoose = require("mongoose");
const Dishes = require("./models/dishes");
const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then(
    db => {
        console.log("Connected correctly to server");
    },
    err => {
        console.log(err);
    }
);

app.all('*', (req, res, next) => {
    if(req.secure) return next();
    else res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
})

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//app.use(favicon(__dirname + '/public/images/favicon.ico'));
//app.use(favicon());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// app.use(cookieParser('12345-67890-09876-54321'));

app.use(
    session({
        name: "session-id",
        secret: "12345-67890-09876-54321",
        saveUninitialized: false,
        resave: false,
        store: new FileStore()
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth (req, res, next) {
    console.log(req.user);

    if (!req.user) {
        let err = new Error('You are not authenticated!');
        err.status = 403;
        next(err);
    }
    else {
        next();
    }
}

app.use(auth);

app.use(express.static(path.join(__dirname, "public")));

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use('/imageUpload',uploadRouter);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    // next is the last argument in above function
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        error: {}
    });
});

module.exports = app;

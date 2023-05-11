var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyparser = require('body-parser');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var usersAllRouter = require('./routes/usersAll');
var questionnairesRouter = require('./routes/questionnaires');
var metricsDoctorRouter = require('./routes/metrics/metricsDoctor');
var metricsPatientRouter = require('./routes/metrics/metricsPatient');
var answersPatientRouter = require('./routes/answers/answersPatient');
var answersDoctorRouter = require('./routes/answers/answersDoctor');
var requestsDoctorRouter = require('./routes/permissionRequests/permissionRequestsDoctor');
var DestinationsPatientRouter = require('./routes/PatientDestinations/patintesDestinations');
var patientMessagesRouter = require('./routes/messages/patientsMessages');
var doctorMessagesRouter = require('./routes/messages/doctorsMessages');
var instructionsSurgeryRouter = require('./routes/instructions/doctorsInstructions');
var exercisesDoctorRouter = require('./routes/exercises/doctorsExercises');
var compereByDoctorRouter = require('./routes/comperePatients/compereByDoctor');
const { onOpen, onError } = require("./instructionsUpload/my-gridfs-service");

var app = express();
var cors = require('cors');

const corsConfig = {
  origin: true,
  credentials: true
};

app.use(cors());
// app.options("*", cors(corsConfig));

app.use("/",indexRouter,  function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,x-auth-token, Access-Control-Allow-Headers, X-Requested-With');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE, OPTIONS');

  next();
});

app.use('/auth', authRouter);

app.use(bodyparser.urlencoded({
  extended: true
}));

var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = "mongodb://localhost:27017/modamedicDB";
var finalUri = process.env.MONGO_URL || mongoDB;
mongoose.connect(finalUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Get the default connection
const db = mongoose.connection;

db.once('open', function (err) {
  if (!err) {
    console.log("connected to mongo db");
    onOpen(db.db);
  }
  else
    console.log("failed");
});

//Bind connection to error event (to get notification of connection errors)
db.on('error', function () {
  console.error.bind(console, 'MongoDB connection error:');
  onError();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/auth/usersAll', usersAllRouter);
app.use('/questionnaires', questionnairesRouter);
app.use('/auth/patients/metrics', metricsPatientRouter);
app.use('/auth/doctors/metrics', metricsDoctorRouter);
app.use('/auth/patients/answers', answersPatientRouter);
app.use('/auth/doctors/answers', answersDoctorRouter);
app.use('/auth/doctors/permissionRequests', requestsDoctorRouter);
app.use('/auth/patients/PatientDestinations', DestinationsPatientRouter);
app.use('/auth/patients/messages', patientMessagesRouter);
app.use('/auth/doctors/messages', doctorMessagesRouter);
app.use('/auth/doctors/instructions', instructionsSurgeryRouter);
app.use('/auth/doctors/exercises', exercisesDoctorRouter);
app.use('/auth/doctors/comperePatients',compereByDoctorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//helper function to build up the desire time trigger
function forceMidnightGroupsDataCalculations(hour,minute)
{
  var t = new Date();
  t.setHours(hour);
  t.setMinutes(minute);
  t.setSeconds(0);
  t.setMilliseconds(0);
  return t;
}

let comperePatients =require('./modules/ComperePatients');

//get your offset to wait value
var cron = require('node-cron');

cron.schedule('00 04 09 * * *', () => {
  comperePatients.calculateGroupsData().then(r => console.log("finish midnight calculations for patients compere"));
});

module.exports = app;
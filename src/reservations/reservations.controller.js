/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary= require("../errors/asyncErrorBoundary")

const validStatus = ["booked", "seated", "finished", "cancelled"];

//middleware
function hasFirst(req, res, next){
  const {data: {first_name}=""}= req.body;
  if(first_name){
    res.locals.first_name=first_name;
    return next();
  }else{
    next({
      status: 400,
      message: `Must include first_name`
    });
  }
}

function hasLast(req, res, next){
  const {data: {last_name}=""}= req.body;
  if(last_name){
    res.locals.last_name=last_name;
    return next();
  }else{
    next({
      status: 400,
      message: `Must include last_name`
    });
  }
}

function hasMobile(req, res, next){
  const {data: {mobile_number}=""}= req.body;
  if(mobile_number){
    res.locals.mobile_number=mobile_number;
    return next();
  }else{
    next({
      status: 400,
      message: `Must include mobile_number`
    });
  }
}

async function hasDate(req, res, next){
  const {data: {reservation_date}=""}= req.body;
  if(Date.parse(reservation_date)){
    res.locals.reservation_date=reservation_date;
    return next();
  }else{
    next({
      status: 400,
      message: `Must include reservation_date`
    });
  }
}

function validateTime (time) {
  const timeReg = (/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/);
  const timeRegSeconds = (/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/);
  return (time.match(timeReg) || time.match(timeRegSeconds));
}

function hasTime(req, res, next){
  const {data: {reservation_time}=""}= req.body;

  if(reservation_time && validateTime(reservation_time)){
    res.locals.reservation_time=reservation_time;
    return next();
  }else{
    next({
      status: 400,
      message: `Must include reservation_time`
    });
  }
}

function dateTimeValidation(req, res, next){
  const errors=[];
  const {reservation_date, reservation_time}= res.locals;
  const rightNow= new Date();
  
  //get reservation as date object by parsing the information
  const [year, month, day]= reservation_date.split("-");
  const [hours, minutes]= reservation_time.split(":");
  const resDate= new Date(Number(year), Number(month)-1, Number(day), Number(hours), Number(minutes), 0);

  //convert to miliseconds
  const nowMili= rightNow.valueOf();
  const resMili= resDate.valueOf();

  //find the day of the week
  const weekday= resDate.getDay();

  //compare reservation time to opening and closing/lastcall hours
  const resTime= Number(hours)*60 + Number(minutes);
  const opening= 10*60 +30;
  const closing= 21*60 +30;

  if(resMili<nowMili){
    errors.push("Reservation must be in the future.");
  }if(weekday==2){
    errors.push("We are are closed Tuesdays.");
  }if(resTime<opening || resTime>closing){
    errors.push("Restuarant is unable to take reservations before 10:30am and after 9:30pm.");
  }if(errors[0]){
    res.locals.errors=errors;
    next({
      status: 400,
      message: `${errors}`});
  }else{
    return next();
  }
}

function hasPeople(req, res, next){
  const {data: {people}=""}= req.body;
  if(Number.isInteger(people) && people>0){
    res.locals.people=people;
    return next();
  }else{
    next({
      status: 400,
      message: `Must include people`
    });
  }
}

function checkStatus(req, res, next){
  const {data: {status}=""}= req.body;
  if(status==="seated" || status==="finished"){
    next({
      status: 400,
      message: `Status can not be seated or finished`
    });
  }
  return next();
}

function checkUpdatedStatus(req, res, next){
  const {data: {status}=""} = req.body;
  const {foundRes}= res.locals;
  if(foundRes.status==="finished"){
    next({
      status: 400,
      message: `Reservation is already finished`
    });
  }
  if(validStatus.includes(status)){
    res.locals.status=status;
    return next();
  }else{
    next({
      status: 400,
      message: `Status is unknown`
    });
  }

}

async function ifExists (req, res, next){
  const foundReservation= await service.read(req.params.reservationId);
  if(foundReservation){
      res.locals.foundRes = foundReservation;
      return next();
  }else{
      next({status: 404, message:`Reservation ${req.params.reservationId} cannot be found.`});
  }
}

//VERBS
async function list(req, res) {
  const {date="", mobile_number=""}=req.query;
  let data;
  if(date){
    data= await service.listByDate(date);
  }else if(mobile_number){
    data= await service.search(mobile_number);
  }
  else{
    data = await service.list();
  }
  res.status(200).json({data});
}

async function read(req, res){
  const {foundRes} = res.locals;
  res.status(200).json({data: foundRes});
}

async function create(req, res){
  const reservation= res.locals;
  
  const data = await service.create(reservation);
  res.status(201).json({data});
}

async function updateStatus(req, res){
  const {status, foundRes}= res.locals;
  const data= await service.updateStatus(foundRes.reservation_id, status);
  res.status(200).json({data});
}

async function update(req, res){
  const newReservation={
    ...req.body.data,
  };
  const data= await service.update(newReservation);
  res.status(200).json({data});
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasFirst, hasLast, hasMobile, hasDate, hasTime, dateTimeValidation, hasPeople, checkStatus, asyncErrorBoundary(create)],
  read: [ifExists, asyncErrorBoundary(read)],
  updateStatus: [ifExists, checkUpdatedStatus, asyncErrorBoundary(updateStatus)],
  update: [ifExists, hasFirst, hasLast, hasMobile, hasDate, hasTime, dateTimeValidation, hasPeople, asyncErrorBoundary(update)],
  reservationExists: [ifExists]
}

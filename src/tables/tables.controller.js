const service = require("./tables.service");
const asyncErrorBoundary= require("../errors/asyncErrorBoundary");
const reservations= require("../reservations/reservations.service");

//middleware
function hasTableName(req, res, next){
    const {data: {table_name}=""}= req.body;
    if(table_name && table_name.length>1){
      res.locals.tableName=table_name;
      return next();
    }else{
      next({
        status: 400,
        message: `Must include table_name`
      });
    }
}
function hasCapacity(req, res, next){
    const {data: {capacity}=""}= req.body;
    if(Number.isInteger(capacity) && capacity>0){
      res.locals.capacity=capacity;
      return next();
    }else{
      next({
        status: 400,
        message: `Must include capacity`
      });
    }
}

async function ifExists (req, res, next){
  const {tableId=""}= req.params;
  const foundTable= await service.read(tableId);
  
  if(foundTable){
      res.locals.foundTable = foundTable;
      return next();
  }else{
      next({
        status: 404, 
        message:`Table ${tableId} cannot be found.`
      });
  }
}

async function hasReservation(req, res, next){
  const {data: {reservation_id}=""}= req.body;
  if(reservation_id ){
    res.locals.reservation_id=reservation_id;
    const foundRes= await reservations.read(reservation_id);
    
    if(typeof foundRes === "object"){
      res.locals.foundRes= foundRes;
      return next();
    }else{
      next({
        status: 404, 
        message:`Reservation_id ${reservation_id} not found`
      });
    }
  }else{
    next({
      status: 400, 
      message:`Must include reservation_id`
    });
  }
}

function isReservationSat(req, res, next){
  const {foundRes}= res.locals;
  if(foundRes.status!=="booked"){
    next({
      status: 400, 
      message:`Reservation is has already been seated`
    });
  }
  return next();
}

function checkTableCapacity(req, res, next){
  const {foundRes, foundTable}= res.locals;
  if(foundRes.people > foundTable.capacity){
    next({
      status: 400, 
      message:`Table capacity is less than number of people`
    });
  }
  return next();
}

function isFree(req, res, next){
  const {foundTable}= res.locals;
  if(foundTable.reservation_id){
    next({
      status: 400, 
      message:`Table is occupied.`
    });
  }
  return next();
}

function isOccupied(req, res, next){
  const {foundTable}= res.locals;
  if(!foundTable.reservation_id){
    next({
      status: 400, 
      message:`Table is not occupied.`
    });
  }
  return next();
}

//VERBS
async function list(req, res) {
    let data= await service.list();
    res.status(200).json({data});
}
  
async function create(req, res){
    const {tableName, capacity}= res.locals;
    const table={
        table_name: tableName,
        capacity: capacity
    };
    const data = await service.create(table);
    res.status(201).json({data});
}

async function seat(req, res){
  const {foundTable, reservation_id} = res.locals;
  
  const updatedTable= {
    ...foundTable,
    reservation_id: reservation_id
  };
  await reservations.updateStatus(reservation_id, "seated");
  const data= await service.update(updatedTable);
  res.status(200).json({data});
}

async function finish(req, res){
  const {foundTable}= res.locals;
  const data= await reservations.updateStatus(foundTable.reservation_id, "finished");
  await service.finish(foundTable.table_id);
  res.status(200).json({data});
}
  
module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasTableName, hasCapacity, asyncErrorBoundary(create)],
  seat: [ifExists, isFree, hasReservation, isReservationSat, checkTableCapacity, asyncErrorBoundary(seat)],
  finish: [ifExists, isOccupied, asyncErrorBoundary(finish)]
};
const knex = require("../db/connection");

function list(){
    return knex("reservations").select("*");
}

function listByDate(reservation_date){
    return knex ("reservations")
    .select("*")
    .whereNot({status: "finished"})
    .andWhere({reservation_date})
    .orderBy("reservation_time");
}

function read(reservation_id){
    return knex("reservations")
    .select("*")
    .where({reservation_id})
    .first();
}

function create(reservation){
    return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createRecords)=> createRecords[0]);
}

function updateStatus(reservation_id, status){
    return knex("reservations")
        .where({reservation_id})
        .update({status: status})
        .then(()=>{
            return knex("reservations")
            .where({reservation_id})
            .first();
        });
}

function search(mobile_number) {
    return knex("reservations")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_date");
       
      //another option
      // .where("mobile_number", "like", `%${mobile_number}%`)
      // .orderBy("reservations_date");
}

function update(reservation){
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservation.reservation_id })
        .update(reservation, ["*"])
        .then((updatedRecords) => updatedRecords[0]);
}


module.exports={
    list,
    listByDate,
    read,
    create,
    updateStatus,
    search,
    update
};
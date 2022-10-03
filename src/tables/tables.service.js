const knex = require("../db/connection");

function list(){
    return knex("tables")
    .select("*")
    .orderBy("table_name");
}
function read(table_id){
    return knex("tables")
    .select("*")
    .where({table_id})
    .first();
}

function create(table){
    return knex("tables")
    .insert(table)
    .returning("*")
    .then((createRecords)=> createRecords[0]);
}

function update(table){
    return knex("tables")
    .select("*")
    .where({table_id: table.table_id})
    .update(table, ["*"]);
}

function finish(table_id){
    return knex("tables")
        .where({table_id})
        .update({reservation_id: null});
}

module.exports={
    list,
    read, 
    create,
    update,
    finish
};
import mysql from "mysql2";

import dotenv from "dotenv";
dotenv.config()


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getUsers(){
    const [result] = await pool.query("SELECT * FROM users");
    return result;
}

export async function getUser(id){
    const [result] = await pool.query(`
        SELECT *
        FROM users
        WHERE userID = ?
        `, [id])
    return result[0]
}

export async function getServers(){
    const [result] = await pool.query("SELECT * FROM servers");
    return result;
}

export async function getServer(id){
    const [result] = await pool.query(`
        SELECT *
        FROM servers
        WHERE serverID = ?
        `, [id])
    return result[0]
}

//console.log(await getUser(1));


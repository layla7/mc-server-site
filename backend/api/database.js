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
    const [result] = await pool.query(`
        SELECT serverID, playerCount, serverAddress, serverBanner, name, sponsored
        FROM servers
        ORDER BY sponsored DESC, weight DESC
        `);
    return result;
}

export async function getServer(id){
    const [result] = await pool.query(`
        SELECT *
        FROM servers, users
        WHERE serverID = ?
        AND users.userID = servers.Users_userID
        `, [id])
    return result[0]
}

export async function getServerReviews(serverID){
    const [result] = await pool.query(`
        SELECT *
        FROM reviews
        WHERE Servers_serverID = ?
        `, [serverID])
    return result
}

export async function getReview(serverID, reviewNo){
    const [result] = await pool.query(`
        SELECT *
        FROM reviews
        WHERE Servers_serverID = ? AND reviewNo = ?
        `, [serverID, reviewNo])
    return result[0]
}

//console.log(await getUser(1));


import mysql from "mysql2";
import mcping from "mcping-js";
import randomstring from "randomstring";

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
        WHERE approved = 1
        ORDER BY sponsored DESC, weight DESC;
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

export async function getServerEdits(serverId){
    const [result] = await pool.query(`
        SELECT *
        FROM serverEdits
        WHERE Servers_serverID = ?
        `, [serverId])
    return result;
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

//Remove server listing
export async function deleteServer(serverID){
    const [result] = await pool.query(`
        DELETE FROM servers
        WHERE serverID = ?
        `,[serverID])
    return result;
}

export async function deleteUser(userID){
    await pool.query(`
        DELETE FROM users
        WHERE userID = ?
        `,[userID])
}

export async function deleteReview(reviewID){
    await pool.query(`
        DELETE FROM reviews
        WHERE reviewID = ?
        `,[reviewID])
}

export async function deleteReviewUnverified(reviewNo, serverID){
    await pool.query(`
        DELETE FROM reviewunverified
        WHERE reviewNo = ? AND servers_serverID = ?
        `,[reviewNo,  serverID])
}

export async function deleteServerEdits(editNo, serverID){
    await pool.query(`
        DELETE FROM serverEdits
        WHERE editNo = ? AND servers_serverID = ?
        `,[editNo,  serverID])
}

export async function setServerEditsApproved(serverID){
    await pool.query(`
        UPDATE serverEdits
        SET approved = 0
        WHERE Servers_serverID = ?
        `,[serverID])
}

export async function postServerEdits(array){
    await pool.query(`
        INSERT INTO serverEdits (Servers_serverID,editNo,Users_userID, serverAddress, serverBanner,
        name,owner,approved,longDescription,shortDescription,
        discord,videoLink,Location,gameVersion,Java,Bedrock,serverRules,moderationDescription, 
        bedwars,smp, survival, modded, pixelmon, parkour, prison, skyblock, creative,
        minigames, anarchy, pvp, pve, economy, hardcore, adventure,
        vanilla, crossplay, tekkit, ftb, factions, hungerGames, cobblemon, McMMO,
        landClaim, rpg, towny, earth, skywars, survivalGames, familyFriendly, spleef, sumo, hideandseek, eggwars)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `, array)
    
    return array[0]
}

export async function postServer(array){
    await pool.query(`
        INSERT INTO servers (serverID,editVersion, Users_userID, serverAddress, serverBanner,
        name,owner,longDescription,shortDescription,
        discord,videoLink,Location,gameVersion,Java,Bedrock,serverRules,moderationDescription, 
        bedwars,smp, survival, modded, pixelmon, parkour, prison, skyblock, creative,
        minigames, anarchy, pvp, pve, economy, hardcore, adventure,
        vanilla, crossplay, tekkit, ftb, factions, hungerGames, cobblemon, McMMO,
        landClaim, rpg, towny, earth, skywars, survivalGames, familyFriendly, spleef, sumo, hideandseek, eggwars,
        averageRating, sponsored, playerCount, lastPing, live, weight, approved)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        , array)
}

export async function updateServer(serverDetails){
    await pool.query(`
        UPDATE servers SET
            editVersion = ?,
            Users_userID = ?,
            serverAddress = ?,
            serverBanner = ?,
            name = ?,
            owner = ?,
            longDescription = ?,
            shortDescription = ?,
            discord = ?,
            videoLink = ?,
            Location = ?,
            gameVersion = ?,
            Java = ?,
            Bedrock = ?,
            serverRules = ?,
            moderationDescription = ?,
            bedwars = ?,
            smp = ?,
            survival = ?,
            modded = ?,
            pixelmon = ?,
            parkour = ?,
            prison = ?,
            skyblock = ?,
            creative = ?,
            minigames = ?,
            anarchy = ?,
            pvp = ?,
            pve = ?,
            economy = ?,
            hardcore = ?,
            adventure = ?,
            vanilla = ?,
            crossplay = ?,
            tekkit = ?,
            ftb = ?,
            factions = ?,
            hungerGames = ?,
            cobblemon = ?,
            McMMO = ?,
            landClaim = ?,
            rpg = ?,
            towny = ?,
            earth = ?,
            skywars = ?,
            survivalGames = ?,
            familyFriendly = ?,
            spleef = ?,
            sumo = ?,
            hideandseek = ?,
            eggwars = ?,
            approved = ?
        WHERE serverID = ?;
        `,serverDetails)
}

async function checkStatus(){
        const [result] = await pool.query(`
            SELECT serverID, serverAddress
            FROM servers
            `)
        
        for (let i = 0; i < result.length; i++){
    
            const server = new mcping.MinecraftServer(result[i].serverAddress)
            
            //Use our minecraft server pinger thingy to ping the server listed.
            server.ping(4000, undefined , (err, res) => {
                let dateTime = new Date().toJSON().replace("T"," ");
                dateTime = dateTime.split(".")[0]
    
    
                //If theres nothing in response then the server is offline/does not exist
                if (res == undefined){
                    pool.query(`
                        UPDATE servers SET live = 0, playerCount = "Offline", lastPing = ? WHERE serverID = ?
                        `,[dateTime,result[i].serverID])
                } else{
                    let playerCount = res.players.online + `/` + res.players.max;

                    pool.query(`
                        UPDATE servers SET live = 1, playerCount = ?, lastPing = ? WHERE serverID = ?
                        `,[playerCount, dateTime, result[i].serverID])
                }
            })
        }
    }

export async function checkSpecificServerStatus(serverID, serverAddress){
    const server = new mcping.MinecraftServer(serverAddress)
            
    //Use our minecraft server pinger thingy to ping the server listed.
    server.ping(4000, undefined , (err, res) => {
        let dateTime = new Date().toJSON().replace("T"," ");
        dateTime = dateTime.split(".")[0]


        //If theres nothing in response then the server is offline/does not exist
        if (res == undefined){
            return ["offline", dateTime, 0]
        } else{
            let playerCount = res.players.online + `/` + res.players.max;
            return [playerCount, dateTime, 1]
        }
    })

}




//Run check status every 5 minutes.
setInterval(() => checkStatus(), 300000)
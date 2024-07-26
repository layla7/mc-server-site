import express from "express";
import randomstring from "randomstring";

import { getUser, getUsers, getServer, getServers, getServerReviews, getReview, deleteUser, deleteServer, postServerEdits, getServerEdits, checkSpecificServerStatus, postServer } from "./database.js";

import dotenv from "dotenv";
dotenv.config()


const app = express();
const port = process.env.API_PORT;

app.use(express.json());


//This is waiting for a get request at the base  of the url
//When this happens it will send "res" which is the response
//back to whatever is making the request
app.get('/', (req, res) => {
    res.send('Hello');
});

//GET Array of all Users
app.get('/api/users', async (req,res) => {
    res.send(await getUsers());
})

//GET Specific User by ID
app.get('/api/users/:id', async (req, res) => {
    res.send(await getUser(req.params.id))
})

//DELETE specific User by ID
app.delete(`/api/users/:id`, async (req, res) => {
    res.send(await deleteUser(req.params.id))

    res.status(200).send("OK")
})

//GET Array of all Servers with reduced info.
app.get('/api/servers', async (req, res) => {
    res.send(await getServers())
})

//GET Specific server by ID with full info.
app.get('/api/servers/:id', async  (req, res) => {
    res.send(await getServer(req.params.id))
})

//DELETE Specific server by ID. Also deletes all linked elements in other tables
app.delete('/api/servers/:id', async (req, res) => {
    await deleteServer(req.params.id)

    //await deleteServer(req.params.id)
    res.status(200).send("OK")
})

app.post("/api/serverEdits/", async (req, res)  => {
    const editNo = (await getServerEdits(req.body.serverID)).length + 1

    const array = [
        req.body.serverID, editNo, req.body.Users_userID, req.body.serverAddress,
        req.body.name, req.body.owner, req.body.longDescription, req.body.shortDescription,
        req.body.discord,req.body.videoLink,req.body.location,req.body.gameVersion,req.body.java,req.body.bedrock,req.body.serverRules,req.body.moderationDescription, 
        req.body.bedwars, req.body.smp, req.body.survival, req.body.modded, req.body.pixelmon, req.body.parkour, req.body.prison, req.body.skyblock, req.body.creative,
        req.body.minigames, req.body.anarchy, req.body.pvp, req.body.pve, req.body.economy, req.body.hardcore, req.body.adventure,
        req.body.vanilla, req.body.crossplay, req.body.tekkit, req.body.ftb, req.body.factions, req.body.hungerGames, req.body.cobblemon, req.body.McMMO,
        req.body.landClaim, req.body.rpg, req.body.towny, req.body.earth, req.body.skywars, req.body.survivalGames, req.body.familyFriendly, req.body.spleef, req.body.sumo, req.body.hideandseek, req.body.eggwars
    ]
    const array2 = [
        req.body.serverID, editNo, req.body.Users_userID, req.body.serverAddress,
        req.body.name, req.body.owner, req.body.approved, req.body.longDescription, req.body.shortDescription,
        req.body.discord,req.body.videoLink,req.body.location,req.body.gameVersion,req.body.java,req.body.bedrock,req.body.serverRules,req.body.moderationDescription, 
        req.body.bedwars, req.body.smp, req.body.survival, req.body.modded, req.body.pixelmon, req.body.parkour, req.body.prison, req.body.skyblock, req.body.creative,
        req.body.minigames, req.body.anarchy, req.body.pvp, req.body.pve, req.body.economy, req.body.hardcore, req.body.adventure,
        req.body.vanilla, req.body.crossplay, req.body.tekkit, req.body.ftb, req.body.factions, req.body.hungerGames, req.body.cobblemon, req.body.McMMO,
        req.body.landClaim, req.body.rpg, req.body.towny, req.body.earth, req.body.skywars, req.body.survivalGames, req.body.familyFriendly, req.body.spleef, req.body.sumo, req.body.hideandseek, req.body.eggwars
    ]

    if (req.body.approved == 1){
        if (req.body.serverID == undefined){
            array[0] = "id-" + randomstring.generate(16);
            array2[0] = array[0]
            //average rating
            array.push(0);
            //Sponsored
            array.push(0)


            //Player count
            //Last ping
            //live
            //const liveInfo = await checkSpecificServerStatus(req.body.serverID);

            array.push("offline");

            let dateTime = new Date().toJSON().replace("T"," ");
            dateTime = dateTime.split(".")[0]
            array.push(dateTime);

            array.push(0);

            //weight
            array.push(0);

            await postServer(array);
        }else{
            console.log("something")
        }
    }

    await postServerEdits(array2)
    res.sendStatus(200)
})

//GET Array of reviews for specific server.
app.get('/api/servers/:id/reviews', async (req, res) => {
    res.send(await getServerReviews(req.params.id))
})

//GET Specific server review by serverID and ReviewNo
app.get('/api/reviews/:serverID/:reviewNo', async (req, res) => {
    res.send(await getReview(req.params.serverID, req.params.reviewNo))
})

//Test GET
app.get('/api/test/querytest', (req, res) => {
    //if we query the api with "?{something}={value}"
    //This is just for our database really which will be performing these actual searches
    //Based on both of these
    res.send(req.query)
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.sendStatus(500).send("Something has gone wrong!")
})

//This listens on port 3000, when this is successful this function is run
app.listen(port, () => console.log(`Listening on port ${port}...`));
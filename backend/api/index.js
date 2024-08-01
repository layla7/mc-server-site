import express from "express";
import randomstring from "randomstring";
import cors from "cors";
import multer from "multer";
import path from "path";
import crypto from "crypto"

import { getUser, getUsers, getServer, getServers, getServerReviews, getReview, deleteUser, deleteServer, postServerEdits, getServerEdits, checkSpecificServerStatus, postServer, setServerEditsApproved, updateServer } from "./database.js";

import dotenv from "dotenv";
dotenv.config()


const app = express();
const port = process.env.API_PORT;

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err);
  
        const filename = raw.toString('hex') + path.extname(file.originalname);
        cb(null, filename);
      });
    }
  });
  
const upload = multer({ storage: storage})


app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/images", express.static('uploads'));


//app.use(express.urlencoded({extended : true}));


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

app.post("/api/serverEdits/images", upload.single("file"), async (req, res) => {
    //console.log(res)
    res.json({location : "http://localhost:3000/images/" + req.file.filename});
    //console.log(res.file.)
})

app.post("/api/serverEdits/", async (req, res)  => {
    const editNo = (await getServerEdits(req.body.serverID)).length + 1

    const serverEdits = [
        req.body.serverID, editNo, req.body.userID, req.body.serverAddress, req.body.serverBanner,
        req.body.name, req.body.owner, req.body.approved, req.body.longDescription, req.body.shortDescription,
        req.body.discord,req.body.videoLink,req.body.location,req.body.gameVersion,req.body.java,req.body.bedrock,req.body.serverRules,req.body.moderationDescription, 
        req.body.bedwars, req.body.smp, req.body.survival, req.body.modded, req.body.pixelmon, req.body.parkour, req.body.prison, req.body.skyblock, req.body.creative,
        req.body.minigames, req.body.anarchy, req.body.pvp, req.body.pve, req.body.economy, req.body.hardcore, req.body.adventure,
        req.body.vanilla, req.body.crossplay, req.body.tekkit, req.body.ftb, req.body.factions, req.body.hungerGames, req.body.cobblemon, req.body.McMMO,
        req.body.landClaim, req.body.rpg, req.body.towny, req.body.earth, req.body.skywars, req.body.survivalGames, req.body.familyFriendly, req.body.spleef, req.body.sumo, req.body.hideandseek, req.body.eggwars
    ]
    const serverArray = [
        req.body.serverID, editNo, req.body.userID, req.body.serverAddress, req.body.serverBanner,
        req.body.name, req.body.owner, req.body.longDescription, req.body.shortDescription,
        req.body.discord,req.body.videoLink,req.body.location,req.body.gameVersion,req.body.java,req.body.bedrock,req.body.serverRules,req.body.moderationDescription, 
        req.body.bedwars, req.body.smp, req.body.survival, req.body.modded, req.body.pixelmon, req.body.parkour, req.body.prison, req.body.skyblock, req.body.creative,
        req.body.minigames, req.body.anarchy, req.body.pvp, req.body.pve, req.body.economy, req.body.hardcore, req.body.adventure,
        req.body.vanilla, req.body.crossplay, req.body.tekkit, req.body.ftb, req.body.factions, req.body.hungerGames, req.body.cobblemon, req.body.McMMO,
        req.body.landClaim, req.body.rpg, req.body.towny, req.body.earth, req.body.skywars, req.body.survivalGames, req.body.familyFriendly, req.body.spleef, req.body.sumo, req.body.hideandseek, req.body.eggwars
    ]


    if (req.body.approved == 1){
        //Check if we've passed a serverID. If not then we assume it's a new server and need to generate it's ID
        if (req.body.serverID == undefined){
            //Since this is a new server generate it's ID
            serverArray[0] = "id-" + randomstring.generate(16);
            serverEdits[0] = serverArray[0]

            //averageRating
            serverArray.push(0);
            //Sponsored
            serverArray.push(0);
            //Player count
            serverArray.push("offline");
            //last ping
            let dateTime = new Date().toJSON().replace("T"," ");
            dateTime = dateTime.split(".")[0]
            serverArray.push(dateTime);
            //live
            serverArray.push(0);
            //weight
            serverArray.push(0);
            //approved
            serverArray.push(1);
            //We've created our new server and added it to the site. this is LIVE
            await postServer(serverArray);
        } else{
            //Set all our other edits to zero as we now have a different awesome new live one.
            await setServerEditsApproved(serverArray[0])

            //approved
            serverArray.push(1);

            serverArray.shift();

            serverArray.push(req.body.serverID);

            await updateServer(serverArray);
        }
    } else{
        if (req.body.serverID == undefined){
            //Since this is a new server generate it's ID
            serverArray[0] = "id-" + randomstring.generate(16);
            serverEdits[0] = serverArray[0]

            //averageRating
            serverArray.push(0);
            //Sponsored
            serverArray.push(0);
            //Player count
            serverArray.push("offline");
            //last ping
            let dateTime = new Date().toJSON().replace("T"," ");
            dateTime = dateTime.split(".")[0]
            serverArray.push(dateTime);
            //live
            serverArray.push(0);
            //weight
            serverArray.push(0);
            //approved
            serverArray.push(0);
            //We've created our new server and added it to the site. this is LIVE
            await postServer(serverArray);
        }
    }

    //No matter what serverEdits is getting what's being set put to it.
    await postServerEdits(serverEdits)
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
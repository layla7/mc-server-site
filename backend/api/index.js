import express from "express";

import { getUser, getUsers, getServer, getServers, getServerReviews, getReview } from "./database.js";

import dotenv from "dotenv";
dotenv.config()


const app = express();
const port = process.env.API_PORT;


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

//GET Array of all Servers with reduced info.
app.get('/api/servers', async (req, res) => {
    res.send(await getServers())
})

//GET Specific server by ID with full info.
app.get('/api/servers/:id', async  (req, res) => {
    res.send(await getServer(req.params.id))
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

//This listens on port 3000, when this is successful this function is run
app.listen(port, () => console.log(`Listening on port ${port}...`));
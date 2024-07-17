import express from "express";

import { getUser, getUsers, getServer, getServers } from "./database.js";

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

//GET Users
app.get('/api/users', async (req,res) => {
    res.send(await getUsers());
})

//GET specific User by ID
app.get('/api/users/:id', async (req, res) => {
    //req.params is the value of what's been sent at the end of the url
    //Returns it in json format
    res.send(await getUser(req.params.id))
})

//GET 
app.get('/api/servers', async (req, res) => {
    res.send(await getServers())
})

app.get('/api/servers/:id', async  (req, res) => {
    res.send(await getServer(req.params.id))
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
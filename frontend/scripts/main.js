const url = "http://127.0.0.1:3000/api/"

function placeCard(serverID, serverName, serverPlayers, imageLocation) {
    var cardLink = $("<div></div>")
    //cardLink.attr("onClick",`changePage(\"${"servers/" + serverID}\")`)
    cardLink.attr("style", "text-decoration: none;")

    cardLink.html(`
                <div class="card text-white bg-primary mb-3" onClick = "changePage('more-info.html', '${serverID}')">
                    <div class="card-body d-flex align-items-center">
                        <!-- Title Area -->
                        <h5 class="card-title mb-0 me-3 flex-grow-1">` + serverName +`</h5>
                        <!-- Online Status Area -->
                        <p class="card-text mb-0 me-3"><strong>`+ serverPlayers +`</strong></p>
                        <!-- Image Area -->
                        <div class="me-3 flex-shrink-0 d-none d-sm-block" style="max-width: 40%;">
                            <img src="` + imageLocation + `" class="img-fluid" alt="Banner Image">
                        </div>
                        <!-- Button Area -->
                        <button type="button" class="btn btn-primary">Copy Address</button>
                    </div>
                </div>
        `)

    cardLink.appendTo("#mainContents")
}

function getGenresArray(jsonData){

    //I apologise sincerely to anyone who has ever believed in me as a programmer.
    let genres = [
        ["Bedwars", jsonData.bedwars ? true : false],
        ["SMP", jsonData.smp ? true : false],
        ["Survival", jsonData.survival ? true : false],
        ["Modded", jsonData.modded ? true : false],
        ["Pixelmon", jsonData.pixelmon ? true : false],
        ["Parkour", jsonData.parkour ? true : false],
        ["Prison", jsonData.prison ? true : false],
        ["Skyblock", jsonData.skyblock ? true : false],
        ["Creative", jsonData.creative ? true : false],
        ["Minigames", jsonData.minigames ? true : false],
        ["Anarchy", jsonData.anarchy ? true : false],
        ["PVP", jsonData.pvp ? true : false],
        ["PVE", jsonData.pve ? true : false],
        ["Economy", jsonData.economy ? true : false],
        ["Hardcore", jsonData.hardcore ? true : false],
        ["Adventure", jsonData.adventure ? true : false],
        ["Vanilla", jsonData.vanilla ? true : false],
        ["Crossplay", jsonData.crossplay ? true : false],
        ["Tekkit", jsonData.tekkit ? true : false],
        ["FTB", jsonData.ftb ? true : false],
        ["Factions", jsonData.factions ? true : false],
        ["Hunger Games", jsonData.hungerGames ? true : false],
        ["Cobblemon", jsonData.cobblemon ? true : false],
        ["McMMO", jsonData.McMMO ? true : false],
        ["Land Claim", jsonData.landClaim ? true : false],
        ["RPG", jsonData.rpg ? true : false],
        ["Towny", jsonData.towny ? true : false],
        ["Earth", jsonData.earth ? true : false],
        ["Skywars", jsonData.skywars ? true : false],
        ["Survival Games", jsonData.survivalGames ? true : false],
        ["Family Friendly", jsonData.familyFriendly ? true : false],
        ["Spleef", jsonData.spleef ? true : false],
        ["Sumo", jsonData.sumo ? true : false],
        ["Hide and Seek", jsonData.hideandseek ? true : false],
        ["Eggwars", jsonData.eggwars ? true : false]
    ];

    return genres;   
}

function changePage(location, id){
    window.location.href = location + "#" + id
}

async function getRequest(suffix){
    getURL = url + suffix;

    const response = await fetch(
        getURL,
        {
            method: "GET"
        }
    )

    const jsonData = await response.json();

    return jsonData;
}

function index(){
    //setSuffix("servers")
    getRequest("servers")
    .then((jsonData) => {
        for(i=0; i < jsonData.length; i++){
            placeCard((jsonData[i].serverID), jsonData[i].name, jsonData[i].playerCount, jsonData[i].serverBanner)
        } 
    })
}

async function apiTester(){

    const response = await fetch("https://api.mcsrvstat.us/3/org.blockhero.net")

    const data = await response.json()
}
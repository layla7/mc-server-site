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

function placeMoreInfo(jsonData){
    //console.log(jsonData.name)
    $("#name").html("<STRONG>" + jsonData.name + "</STRONG>");
    $("#shortDescription").html(jsonData.shortDescription);
    $("#serverBanner").attr("src", jsonData.serverBanner);
    $("#longDescription").html(jsonData.longDescription);
    $("#moderationTitle").html("Moderation at " + jsonData.name + ":");
    $("#moderationDescription").html(jsonData.moderationDescription);
    $("#moderationAdditional").html(jsonData.moderationAdditional);
    $("#serverRules").html(jsonData.serverRules); 
    
    if (jsonData.videoLink != undefined) {

        if (jsonData.videoLink.includes("youtu.be/")){

            var splitURL = jsonData.videoLink.split("youtu.be/");

            splitURL = (splitURL[1].split("?"))[0];

        } else if (jsonData.videoLink.includes("youtube.com/")){

            var splitURL = jsonData.videoLink.split("youtube.com/");

            splitURL = (splitURL[1].split("v="))[1];

        }else splitURL = "";

        $("#videoArea").html(`
            <div class="embed-responsive" style="text-align: center;">
                <iframe class="embed-responsive-item youtube" src="` + "https://www.youtube.com/embed/" + splitURL + "?rel=0" + `" allowfullscreen></iframe>
            </div>
        `)
        $('#videoArea').addClass('pt-4');
    }


    var genresArray = getGenresArray(jsonData);



    var genreArea = $("<div></div>");
    genreArea.addClass("d-flex py-2");

    genreArea.append(`<div style="width: 100%; overflow: auto;"><strong>Server Tags:</strong></div>`)
    var genreCardZone = $(`<div style="width: 100%; overflow: auto;"></div>`)

    for (i = 0; i < genresArray.length; i++){
        genreCardZone.append(`<span class="badge bg-secondary px-1">` + genresArray[i] + `</span>` + " ")
    }
    
    genreArea.append(genreCardZone);
    $("#shortInfo").append(genreArea);

    //console.log(genresArray);

}

function getGenresArray(jsonData){
    var array = [];

    //I apologise sincerely to anyone who has ever believed in me as a programmer.
    if (jsonData.bedwars) array.push("Bedwars");
    if (jsonData.smp) array.push("SMP");
    if (jsonData.survival) array.push("Survival");
    if (jsonData.modded) array.push("Modded");
    if (jsonData.pixelmon) array.push("Pixelmon");
    if (jsonData.parkour) array.push("Parkour");
    if (jsonData.prison) array.push("Prison");
    if (jsonData.skyblock) array.push("Skyblock");
    if (jsonData.creative) array.push("Creative");
    if (jsonData.minigames) array.push("Minigames");
    if (jsonData.anarchy) array.push("Anarchy");
    if (jsonData.pvp) array.push("PVP");
    if (jsonData.pve) array.push("PVE");
    if (jsonData.economy) array.push("Economy");
    if (jsonData.hardcore) array.push("Hardcore");
    if (jsonData.adventure) array.push("Adventure");
    if (jsonData.vanilla) array.push("Vanilla");
    if (jsonData.crossplay) array.push("Crossplay");
    if (jsonData.tekkit) array.push("Tekkit");
    if (jsonData.ftb) array.push("FTB");
    if (jsonData.factions) array.push("Factions");
    if (jsonData.hungerGames) array.push("hungerGames");
    if (jsonData.cobblemon) array.push("Cobblemon");
    if (jsonData.McMMO) array.push("McMMO");
    if (jsonData.landClaim) array.push("Land Claim");
    if (jsonData.rpg) array.push("RPG");
    if (jsonData.towny) array.push("Towny");
    if (jsonData.earth) array.push("Earth");
    if (jsonData.skywars) array.push("Skywars");
    if (jsonData.survivalGames) array.push("Survival Games");
    if (jsonData.familyFriendly) array.push("Family Friendly");
    if (jsonData.spleef) array.push("Spleef");
    if (jsonData.sumo) array.push("Sumo");
    if (jsonData.hideandseek) array.push("hide&seek");
    if (jsonData.eggwars) array.push("eggwars");

    return array;
    
}

function moreInfo(){
    id = window.location.hash.substring(1)

    getRequest("servers/" + id)
    .then(jsonData => {
        placeMoreInfo(jsonData)
    })
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
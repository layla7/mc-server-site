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
                        <div class="me-3 flex-shrink-0 d-none d-sm-block" style="width: 40%;">
                            <img src="` + imageLocation + `" style = "width: 100%; max-height: 100px" alt="Banner Image">
                        </div>
                        <!-- Button Area -->
                        <button type="button" class="btn btn-primary">Copy Address</button>
                    </div>
                </div>
        `)

    let genresArray = getGenresArray({});
    console.log(genresArray);

    for (let i = 0; i < genresArray.length; i = i + 2) {
        tickboxesString = `<div class = "d-flex py-2">
                                <div style="width: 100%; overflow: auto;">
                                    <div class="form-group form-check">
                                        <input name = "` + genresArray[i][0] + `" type="checkbox" class="form-check-input" id="input-` + genresArray[i][0] + `">
                                        <label class="form-check-label" for="input-` + genresArray[i][0] + `">` + genresArray[i][0] + `</label>
                                    </div>
                                </div>`

        if (genresArray[i + 1] != undefined) tickboxesString = tickboxesString + `
                    <div style="width: 100%; overflow: auto;">
                        <div class="form-group form-check">
                            <input name = "` + genresArray[i][0] + `" type="checkbox" class="form-check-input" id="input-` + genresArray[i + 1][0] + `">
                            <label class="form-check-label" for="input-` + genresArray[i + 1][0] + `">` + genresArray[i + 1][0] + `</label>
                        </div>
                    </div>
                </div>`

        $("#input-genresCheckboxes").append(tickboxesString)
    }

    cardLink.appendTo("#mainContents")
}

function getGenresArray(jsonData){

    //I apologise sincerely to anyone who has ever believed in me as a programmer.
    let genres = [
        ["Bedwars", jsonData.bedwars ? true : false, "bedwars"],
        ["SMP", jsonData.smp ? true : false, "smp"],
        ["Survival", jsonData.survival ? true : false, "survival"],
        ["Modded", jsonData.modded ? true : false, "modded"],
        ["Pixelmon", jsonData.pixelmon ? true : false, "pixelmon"],
        ["Parkour", jsonData.parkour ? true : false, "parkour"],
        ["Prison", jsonData.prison ? true : false, "prison"],
        ["Skyblock", jsonData.skyblock ? true : false, "skyblock"],
        ["Creative", jsonData.creative ? true : false, "creative"],
        ["Minigames", jsonData.minigames ? true : false, "minigames"],
        ["Anarchy", jsonData.anarchy ? true : false, "anarchy"],
        ["PVP", jsonData.pvp ? true : false, "pvp"],
        ["PVE", jsonData.pve ? true : false, "pve"],
        ["Economy", jsonData.economy ? true : false, "economy"],
        ["Hardcore", jsonData.hardcore ? true : false, "hardcore"],
        ["Adventure", jsonData.adventure ? true : false, "adventure"],
        ["Vanilla", jsonData.vanilla ? true : false, "vanilla"],
        ["Crossplay", jsonData.crossplay ? true : false, "crossplay"],
        ["Tekkit", jsonData.tekkit ? true : false, "tekkit"],
        ["FTB", jsonData.ftb ? true : false, "ftb"],
        ["Factions", jsonData.factions ? true : false, "factions"],
        ["Hunger Games", jsonData.hungerGames ? true : false, "hungerGames"],
        ["Cobblemon", jsonData.cobblemon ? true : false, "cobblemon"],
        ["McMMO", jsonData.McMMO ? true : false, "McMMO"],
        ["Land Claim", jsonData.landClaim ? true : false, "landClaim"],
        ["RPG", jsonData.rpg ? true : false, "rpg"],
        ["Towny", jsonData.towny ? true : false, "towny"],
        ["Earth", jsonData.earth ? true : false, "earth"],
        ["Skywars", jsonData.skywars ? true : false, "skywars"],
        ["Survival Games", jsonData.survivalGames ? true : false, "survivalGames"],
        ["Family Friendly", jsonData.familyFriendly ? true : false, "familyFriendly"],
        ["Spleef", jsonData.spleef ? true : false, "spleef"],
        ["Sumo", jsonData.sumo ? true : false, "sumo"],
        ["Hide and Seek", jsonData.hideandseek ? true : false, "hideandseek"],
        ["Eggwars", jsonData.eggwars ? true : false, "eggwars"]
    ];
    return genres;   
}

function changePage(location, id){
    window.location.href = location + "#" + id
}

async function formSubmit(){

    const formData = new FormData();

    let id = undefined;


    if ($(window.location).attr("href").includes("index.html")){
        id = undefined;
    } else id = window.location.hash.substring(1);

    //formData.append("name", "Lowrie")
    formData.append("file", $("#input-serverBanner").prop("files")[0])

    const location = await fetch(
        url + "serverEdits/images",{
        method : "POST",
        body : formData,
    })

    const serverBannerInfo = await location.json();

    const dictionary = {
        serverID : id,
        serverAddress : $("#input-serverAddress").val(),
        name : $("#input-name").val(),
        owner : $("#input-owner").val(),
        approved : $("#input-approved").is(":checked") ? 1 : 0,
        java : $("#input-java").is(":checked") ? 1 : 0,
        bedrock : $("#input-bedrock").is(":checked") ? 1 : 0,
        secondaryAddress : $("#input-secondaryAddress").val(),
        longDescription : $("#input-longDescription").val(),
        shortDescription : $("#input-shortDescription").val(),
        serverBanner : serverBannerInfo.location,
        discord : $("#input-discord").val(),
        videoLink : $("#input-videoLink").val(),
        location : $("#input-location").val(),
        serverRules : $("#input-serverRules").val(),
        moderationDescription : $("#input-moderationDescription").val(),
        moderationAdditional : $("#input-moderationAdditional").val(),
        userID : "1"
    }

    let array = getGenresArray({});

    for (let i = 0; i < array.length; i++){
        dictionary[array[i][2]] = $("#input-" + array[i][0]).is(":checked") ? 1 : 0
    }

    const response = await fetch(
        url  + "serverEdits",
        {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(dictionary)
        }
    )
};

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
function placeMoreInfo(jsonData){
    //Placing all that big card stuff.
    $("#name").html("<STRONG>" + jsonData.name + "</STRONG>");
    $("#shortDescription").html(jsonData.shortDescription);
    $("#serverBanner").attr("src", jsonData.serverBanner);
    $("#longDescription").html(jsonData.longDescription);
    $("#moderationTitle").html("Moderation at " + jsonData.name + ":");
    $("#moderationDescription").html(jsonData.moderationDescription);
    $("#moderationAdditional").html(jsonData.moderationAdditional);
    $("#serverRules").html(jsonData.serverRules); 
    
    //Check whether or not a video link has been provided
    if (jsonData.videoLink != undefined) {
        //Format the string to the youtube url for embedding a video.
        //Some youtube shares are "youtu.be" others are "youtube.com" :(
        //We're getting the video id on it's own from the link
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


    //Get the short info card
    var shortInfo = $('#shortInfo');

    $("#shortInfoHeader").html("<strong>" + jsonData.name + "</strong>")

    //Get all information to fill up short info section
    var array = getShortInfo(jsonData);

    //Append array of html elements to fill up short info
    for (i = 0; i < array.length; i++) shortInfo.append(array[i]);

    //Set up the modal with default values of the current stuff.
    $("#input-id").val(jsonData.serverID);
    $("#input-userid").val(jsonData.Users_userID);
    $("#input-name").val(jsonData.name);
    $("#input-serverAddress").val(jsonData.serverAddress);
    $("#input-owner").val(jsonData.owner);
    $("#input-approved").prop("checked" , jsonData.approved  == 1 ? true : false);
    $("#input-longDescription").val(jsonData.longDescription);
    $("#input-shortDescription").val(jsonData.shortDescription);
    $("#input-discord").val(jsonData.discord);
    $("#input-videoLink").val(jsonData.videoLink);
    $("#input-location").val(jsonData.location);
    $("#input-java").prop("checked" , jsonData.java  == 1 ? true : false);
    $("#input-bedrock").prop("checked" , jsonData.bedrock  == 1 ? true : false);
    $("#input-secondaryAddress").val(jsonData.secondaryAddress);
    $("#input-serverRules").val(jsonData.serverRules);
    $("#input-moderationDescription").val(jsonData.moderationDescription);
    $("#input-moderationAdditional").val(jsonData.moderationAdditional);

    let genresArray = getGenresArray(jsonData);

    for (let i = 0; i < genresArray.length; i = i + 2) {
        tickboxesString = `<div class = "d-flex py-2">
                                <div style="width: 100%; overflow: auto;">
                                    <div class="form-group form-check">
                                        <input name = "` + genresArray[i][0] + `" type="checkbox" ` + (genresArray[i][1] ? "checked" : "") + ` class="form-check-input" id="input-` + genresArray[i][0] + `">
                                        <label class="form-check-label" for="input-` + genresArray[i][0] + `">` + genresArray[i][0] + `</label>
                                    </div>
                                </div>`

        if (genresArray[i + 1] != undefined) tickboxesString = tickboxesString + `
                    <div style="width: 100%; overflow: auto;">
                        <div class="form-group form-check">
                            <input name = "` + genresArray[i][0] + `" type="checkbox" ` + (genresArray[i][1] ? "checked" : "") + ` class="form-check-input" id="input-` + genresArray[i + 1][0] + `">
                            <label class="form-check-label" for="input-` + genresArray[i + 1][0] + `">` + genresArray[i + 1][0] + `</label>
                        </div>
                    </div>
                </div>`

        $("#input-genresCheckboxes").append(tickboxesString)
    }
}

$('#EditForm').on('submit', async function(){
    const dictionary = {
        serverID : window.location.hash.substring(1),
        serverAddress : $("#input-serverAddress").val(),
        name : $("#input-name").val(),
        owner : $("#input-owner").val(),
        approved : $("#input-approved").is(":checked") ? 1 : 0,
        java : $("#input-java").is(":checked") ? 1 : 0,
        bedrock : $("#input-bedrock").is(":checked") ? 1 : 0,
        secondaryAddress : $("#input-secondaryAddress").val(),
        longDescription : $("#input-longDescription").val(),
        shortDescription : $("#input-shortDescription").val(),
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
        dictionary[array[i][0]] = $("#input-" + array[i][0]).is(":checked") ? 1 : 0
    }

    await console.log(dictionary);

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

});

function getShortInfo(jsonData){
    var array = [];

    //Check we have a value for the element so we actually have something to place.
    if (jsonData.serverAddress != undefined){
        //If we have both a bedrock and java address list data for both and address them as such
        if (jsonData.bedrock && jsonData.java && jsonData.secondaryAddress != undefined){
            array.push(`<div class = "d-flex py-2">
                <div style="width: 100%; overflow: auto;">
                <strong>Java Address:</strong></div>
                <div style="width: 100%; overflow: auto;">
                <button class="btn btn-secondary my-sm-0" onClick = "navigator.clipboard.writeText('` + jsonData.serverAddress + `')">`
                + jsonData.serverAddress + `</button></div></div>`)

                array.push(`<div class = "d-flex py-2">
                <div style="width: 100%; overflow: auto;">
                <strong>Bedrock Address:</strong></div>
                <div style="width: 100%; overflow: auto;">
                <button class="btn btn-secondary my-sm-0" onClick = "navigator.clipboard.writeText('` + jsonData.secondaryAddress + `')">`
                + jsonData.secondaryAddress + `</button></div></div>`)   
        } // If that's not the case just call it the server address as it could be bedrock or java
        else if (jsonData.secondaryAddress ==  undefined){
            array.push(`<div class = "d-flex py-2">
                <div style="width: 100%; overflow: auto;">
                <strong>Server Address:</strong></div>
                <div style="width: 100%; overflow: auto;">
                <button class="btn btn-secondary my-sm-0" onClick = "navigator.clipboard.writeText('` + jsonData.serverAddress + `')">`
                 + jsonData.serverAddress + `</button></div></div>`)
        }
    }

    //Figure out genres and places them in short info.
    var genresArray = getGenresArray(jsonData);

    var genreArea = $("<div></div>");
    genreArea.addClass("d-flex py-2");

    genreArea.append(`<div style="width: 100%; overflow: auto;"><strong>Server Tags:</strong></div>`)
    var genreCardZone = $(`<div style="width: 100%; overflow: auto;"></div>`)

    let activeGenres = genresArray.filter(mode => mode[1]).map(mode => mode[0]);
    //console.log(presentGenres[0][0])

    for (i = 0; i < activeGenres.length; i++){
        genreCardZone.append(`<span class="badge bg-secondary px-1">` + activeGenres[i] + `</span>` + " ")
    }
    
    genreArea.append(genreCardZone);
    array.push(genreArea);


    if (jsonData.averageRating != undefined){
        array.push(`
                    <div class="d-flex py-2">
                        <div style="width: 100%; overflow: auto;">
                            <strong>Rating:</strong>
                        </div>
                        <div class="Stars bg-primary" style="--rating:` + jsonData.averageRating + `; --star-size: 20px; width:100%; overflow:auto;" aria-label="Rating of this product is 2.3 out of 5."></div>
                    </div>
                    `)
    }

    //Place everything else present for the short area

    if(jsonData.playerCount != undefined){
        if (jsonData.live){
            array.push(`<div class = "d-flex py-2">
                <div style="width: 100%; overflow: auto;">
                <strong>Player Count:</strong></div>
                <div style="width: 100%; overflow: auto;">
                <span class = "badge bg-success">` + jsonData.playerCount + ` Online</span>
                </div></div>`)
        }
        else{
            array.push(`<div class = "d-flex py-2">
                <div style="width: 100%; overflow: auto;">
                <strong>Player Count:</strong></div>
                <div style="width: 100%; overflow: auto;">
                <span class = "badge bg-danger">Offline</span>
                </div></div>`)
        }
    }

    if (jsonData.lastPing != undefined){
        var formattedTime = (jsonData.lastPing.split("T"))[1]
        formattedTime = (formattedTime.split("."))[0]
        formattedTime = formattedTime.substr(0, 5)

        var formattedDate = (jsonData.lastPing.split("T"))[0]


        array.push(`<div class = "d-flex py-2">
                <div style="width: 100%; overflow: auto;">
                <strong>Last Checked:</strong></div>
                <div style="width: 100%; overflow: auto;">
                ` + formattedDate + ` at ` + formattedTime + ` UTC
                </div></div>`)
    } 

    if (jsonData.username != undefined){
        array.push(`<div class = "d-flex py-2">
                <div style="width: 100%; overflow: auto;">
                <strong>Listed by:</strong></div>
                <div style="width: 100%; overflow: auto;">
                <a href="./user-page.html"><span class = "badge bg-secondary" id= "username">` + jsonData.username + `</span>
                </div></div>`)
    }

    if (jsonData.owner != undefined){
        array.push(`
                <div class = "d-flex py-2">
                <div style="width: 100%; overflow: auto;">
                <strong>Owned by:</strong></div>
                <div style="width: 100%; overflow: auto;">`
                + jsonData.owner + `
                </div></div>
                `)
    }

    if (jsonData.gameVersion != undefined){
        array.push(`<div class = "d-flex py-2">
                <div style="width: 100%; overflow: auto;">
                <strong>Game Version:</strong></div>
                <div style="width: 100%; overflow: auto;">
                ` + jsonData.gameVersion + `
                </div></div>`)
    }

    if (jsonData.motd != undefined){
        array.push(`<div class = "d-flex py-2">
            <div style="width: 100%; overflow: auto;">
            <strong>Message of the Day:</strong></div>
            <div style="width: 100%; overflow: auto;">
            ` + jsonData.motd + `
            </div></div>`)
    }

    if (jsonData.location != undefined){
        array.push(`
            <div class = "d-flex py-2">
            <div style="width: 100%; overflow: auto;">
            <strong>Location:</strong></div>
            <div style="width: 100%; overflow: auto;">
            ` + jsonData.location + `
            </div></div>
            `)
    }

    return array;
}

function moreInfo(){
    id = window.location.hash.substring(1)

    getRequest("servers/" + id)
    .then(jsonData => {
        placeMoreInfo(jsonData)
    })
}

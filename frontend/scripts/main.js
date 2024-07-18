const url = "http://127.0.0.1:3000/api/"

//Function to create a card for a server. Appends to main content area.
function placeCard(serverID, serverName, serverPlayers, imageLocation) {
    var cardLink = $("<a></a>").attr("href", "more-info.html")
    cardLink.attr("onClick",`moreInfo(${serverID}))`)
    cardLink.attr("style", "text-decoration: none;")

    cardLink.html(`
                <div class="card text-white bg-primary mb-3" id = "${serverID}" onClick = moreInfo(${serverID})>
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

function moreInfo(){
    getRequest("servers").then(data => {
        data;
        //console.log(data)
    })
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
    getRequest("servers")
    .then((jsonData) => {
        console.log(jsonData)

        for(i=0; i < jsonData.length; i++){
            placeCard(("t" + jsonData[i].serverID), jsonData[i].name, jsonData[i].playerCount, jsonData[i].serverBanner)
        } 
    })
}


console.log(getRequest("servers"))
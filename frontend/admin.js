// ==========================================
// ADRN RESCUE COMMAND CENTER
// ==========================================


// Backend URL

const API_URL =
    "https://adrn-emergency-distress-rescue-network.onrender.com";



// ==========================================
// LOAD SOS REQUESTS
// ==========================================

async function loadSOSRequests() {

    try {

        console.log("📡 Loading SOS requests...");


        const response =
            await fetch(`${API_URL}/api/sos`);


        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );

        }


        const result =
            await response.json();


        console.log(
            "📥 SOS data received:",
            result
        );


        displaySOSRequests(
            result.data
        );


        updateStatistics(
            result.data
        );


        document.getElementById(
            "lastUpdated"
        ).textContent =
            "Last updated: " +
            new Date().toLocaleTimeString();


    } catch (error) {

        console.error(
            "❌ Failed to load SOS:",
            error
        );


        document.getElementById(
            "sosContainer"
        ).innerHTML = `

            <div class="empty">

                ❌ Unable to connect to ADRN backend.

                <br><br>

                Make sure your server is running.

            </div>

        `;

    }

}



// ==========================================
// DISPLAY SOS REQUESTS
// ==========================================

function displaySOSRequests(
    requests
) {

    const container =
        document.getElementById(
            "sosContainer"
        );


    if (!requests || requests.length === 0) {

        container.innerHTML = `

            <div class="empty">

                ✅ No emergency requests currently.

            </div>

        `;

        return;

    }


    container.innerHTML = "";


    requests.forEach(
        function (sos) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "sos-card " +
                sos.status.toLowerCase();


            const statusClass =
                "status-" +
                sos.status.toLowerCase();


            const formattedTime =
                new Date(
                    sos.timestamp
                ).toLocaleString();


            card.innerHTML = `

                <div class="sos-header">

                    <div class="request-id">

                        🚨 ${sos.requestId}

                    </div>


                    <div class="status ${statusClass}">

                        ${sos.status}

                    </div>

                </div>



                <div class="sos-details">


                    <div class="detail">

                        <strong>👤 User</strong>

                        <span>
                            ${sos.userName || "Unknown"}
                        </span>

                    </div>



                    <div class="detail">

                        <strong>📱 Mobile</strong>

                        <span>
                            ${sos.userMobile || "Unknown"}
                        </span>

                    </div>



                    <div class="detail">

                        <strong>📍 Location</strong>

                        <span>
                            ${sos.location}
                        </span>

                    </div>



                    <div class="detail">

                        <strong>⚠️ Emergency</strong>

                        <span>
                            ${sos.reason}
                        </span>

                    </div>



                    <div class="detail">

                        <strong>👥 People</strong>

                        <span>
                            ${sos.people}
                        </span>

                    </div>



                    <div class="detail">

                        <strong>🆘 Help Required</strong>

                        <span>
                            ${sos.helpType}
                        </span>

                    </div>



                    <div class="detail">

                        <strong>🕐 Time</strong>

                        <span>
                            ${formattedTime}
                        </span>

                    </div>



                    <div class="detail">

                        <strong>🪪 Identity</strong>

                        <span>

                            ${
                                sos.identityVerified
                                ? "✅ Verified"
                                : "⚠️ Not Verified"
                            }

                        </span>

                    </div>


                </div>



                <div class="actions">


                    <button
                        class="map-button"
                        onclick="openMap('${sos.location}')"
                    >

                        📍 Open Maps

                    </button>



                    ${
                        sos.status === "PENDING"

                        ? `

                        <button
                            class="respond-button"
                            onclick="updateStatus(
                                '${sos.requestId}',
                                'RESPONDING'
                            )"
                        >

                            🚑 Respond

                        </button>

                        `

                        : ""

                    }



                    ${
                        sos.status === "RESPONDING"

                        ? `

                        <button
                            class="resolve-button"
                            onclick="updateStatus(
                                '${sos.requestId}',
                                'RESOLVED'
                            )"
                        >

                            ✅ Resolve

                        </button>

                        `

                        : ""

                    }


                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

}



// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(
    requests
) {

    const total =
        requests.length;


    const pending =
        requests.filter(
            sos =>
                sos.status === "PENDING"
        ).length;


    const responding =
        requests.filter(
            sos =>
                sos.status === "RESPONDING"
        ).length;


    const resolved =
        requests.filter(
            sos =>
                sos.status === "RESOLVED"
        ).length;


    document.getElementById(
        "totalSOS"
    ).textContent = total;


    document.getElementById(
        "pendingSOS"
    ).textContent = pending;


    document.getElementById(
        "respondingSOS"
    ).textContent = responding;


    document.getElementById(
        "resolvedSOS"
    ).textContent = resolved;

}



// ==========================================
// OPEN LOCATION IN GOOGLE MAPS
// ==========================================

function openMap(
    location
) {

    const parts =
        location.split(",");


    if (parts.length < 2) {

        alert(
            "Invalid location."
        );

        return;

    }


    const latitude =
        parts[0].trim();


    const longitude =
        parts[1].trim();


    const mapURL =
        `https://www.google.com/maps?q=${latitude},${longitude}`;


    window.open(
        mapURL,
        "_blank"
    );

}



// ==========================================
// UPDATE SOS STATUS
// ==========================================

async function updateStatus(
    requestId,
    newStatus
) {

    try {

        console.log(
            `🔄 Updating ${requestId} → ${newStatus}`
        );


        const response =
            await fetch(
                `${API_URL}/api/sos/${requestId}`,
                {

                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        status:
                            newStatus

                    })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Failed to update status"
            );

        }


        console.log(
            "✅ Status updated:",
            result
        );


        await loadSOSRequests();


    } catch (error) {

        console.error(
            "❌ Status update error:",
            error
        );


        alert(
            "Unable to update SOS status."
        );

    }

}



// ==========================================
// REFRESH BUTTON
// ==========================================

document
    .getElementById("refreshButton")
    .addEventListener(
        "click",
        loadSOSRequests
    );



// ==========================================
// INITIAL LOAD
// ==========================================

loadSOSRequests();
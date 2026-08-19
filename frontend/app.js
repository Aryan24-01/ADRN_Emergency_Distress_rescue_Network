// ==========================================
// ADRN - MAIN APPLICATION JAVASCRIPT
// ==========================================

// ==========================================
// LIVE ADRN BACKEND
// ==========================================

const API_BASE_URL =
    "https://adrn-emergency-distress-rescue-network.onrender.com";


// ==========================================
// SCREEN ELEMENTS
// ==========================================

const loadingScreen = document.getElementById("loadingScreen");
const loginScreen = document.getElementById("loginScreen");
const registerScreen = document.getElementById("registerScreen");
const appScreen = document.getElementById("appScreen");


// ==========================================
// USER DATA
// ==========================================

let currentUser =
    JSON.parse(localStorage.getItem("adrnUser")) || null;

let lastSOSLocation = "";


// ==========================================
// LOADING SCREEN
// ==========================================

window.addEventListener("load", function () {

    setTimeout(function () {

        if (loadingScreen) {
            loadingScreen.classList.add("hidden");
        }

        if (currentUser) {

            showApplication();

        } else if (loginScreen) {

            loginScreen.classList.remove("hidden");

        }

    }, 1800);

});


// ==========================================
// SHOW MAIN APPLICATION
// ==========================================

function showApplication() {

    if (loginScreen) {
        loginScreen.classList.add("hidden");
    }

    if (registerScreen) {
        registerScreen.classList.add("hidden");
    }

    if (appScreen) {
        appScreen.classList.remove("hidden");
    }

    loadProfile();

}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const mobile =
                document
                    .getElementById("loginMobile")
                    .value
                    .trim();

            const pin =
                document
                    .getElementById("loginPin")
                    .value
                    .trim();

            const loginMessage =
                document.getElementById("loginMessage");


            if (mobile.length < 10) {

                loginMessage.textContent =
                    "Please enter a valid mobile number.";

                return;
            }


            if (!/^\d{4}$/.test(pin)) {

                loginMessage.textContent =
                    "PIN must contain 4 digits.";

                return;
            }


            const savedUser =
                JSON.parse(
                    localStorage.getItem("adrnUser")
                );


            if (!savedUser) {

                loginMessage.textContent =
                    "No account found. Please create an account first.";

                return;
            }


            if (
                savedUser.mobile === mobile &&
                savedUser.pin === pin
            ) {

                currentUser = savedUser;

                localStorage.setItem(
                    "adrnUser",
                    JSON.stringify(currentUser)
                );

                loginMessage.textContent =
                    "✓ Login successful";


                setTimeout(function () {

                    showApplication();

                }, 500);

            } else {

                loginMessage.textContent =
                    "Invalid mobile number or PIN.";

            }

        }
    );

}


// ==========================================
// OPEN REGISTRATION
// ==========================================

const registerButton =
    document.getElementById("registerButton");

if (registerButton) {

    registerButton.addEventListener(
        "click",
        function () {

            if (loginScreen) {
                loginScreen.classList.add("hidden");
            }

            if (registerScreen) {
                registerScreen.classList.remove("hidden");
            }

        }
    );

}


// ==========================================
// BACK TO LOGIN
// ==========================================

const backToLogin =
    document.getElementById("backToLogin");

if (backToLogin) {

    backToLogin.addEventListener(
        "click",
        function () {

            if (registerScreen) {
                registerScreen.classList.add("hidden");
            }

            if (loginScreen) {
                loginScreen.classList.remove("hidden");
            }

        }
    );

}


// ==========================================
// REGISTRATION
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();

            const mobile =
                document
                    .getElementById("registerMobile")
                    .value
                    .trim();

            const identityId =
                document
                    .getElementById("identityId")
                    .value
                    .trim();

            const pin =
                document
                    .getElementById("registerPin")
                    .value
                    .trim();

            const registerMessage =
                document.getElementById("registerMessage");


            if (name.length < 2) {

                registerMessage.textContent =
                    "Please enter your full name.";

                return;
            }


            if (mobile.length < 10) {

                registerMessage.textContent =
                    "Please enter a valid mobile number.";

                return;
            }


            if (identityId.length < 4) {

                registerMessage.textContent =
                    "Please enter the demo identity ID.";

                return;
            }


            if (!/^\d{4}$/.test(pin)) {

                registerMessage.textContent =
                    "PIN must contain 4 digits.";

                return;
            }


            // Demo user

            const newUser = {

                name: name,

                mobile: mobile,

                pin: pin,

                identityVerified: true,

                identityId: identityId

            };


            localStorage.setItem(
                "adrnUser",
                JSON.stringify(newUser)
            );


            currentUser = newUser;


            registerMessage.textContent =
                "✓ Identity verified. Account created.";


            setTimeout(function () {

                showApplication();

            }, 800);

        }
    );

}


// ==========================================
// NAVIGATION
// ==========================================

const navButtons =
    document.querySelectorAll(".nav-button");

const pages =
    document.querySelectorAll(".page");


navButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const targetPage =
                button.dataset.page;


            navButtons.forEach(function (item) {

                item.classList.remove("active");

            });


            button.classList.add("active");


            pages.forEach(function (page) {

                page.classList.remove("active-page");

            });


            const selectedPage =
                document.getElementById(targetPage);


            if (selectedPage) {

                selectedPage.classList.add(
                    "active-page"
                );

            }

        }
    );

});


// ==========================================
// OPEN PAGE FUNCTION
// ==========================================

function openPage(pageId) {

    pages.forEach(function (page) {

        page.classList.remove("active-page");

    });


    navButtons.forEach(function (button) {

        button.classList.remove("active");

    });


    const target =
        document.getElementById(pageId);


    if (target) {

        target.classList.add("active-page");

    }


    const matchingButton =
        document.querySelector(
            `[data-page="${pageId}"]`
        );


    if (matchingButton) {

        matchingButton.classList.add("active");

    }

}


// ==========================================
// BIG SEND SOS BUTTON
// ==========================================

const sosButton =
    document.getElementById("sosButton");

if (sosButton) {

    sosButton.addEventListener(
        "click",
        function () {

            console.log(
                "🚨 EMERGENCY SOS BUTTON CLICKED"
            );


            openPage("sosPage");


            getLocation();

        }
    );

}


// ==========================================
// LOCATION
// ==========================================

const locationButton =
    document.getElementById("locationButton");

const locationInput =
    document.getElementById("location");


if (locationButton) {

    locationButton.addEventListener(
        "click",
        function () {

            getLocation();

        }
    );

}


function getLocation() {

    console.log(
        "📍 Requesting user location..."
    );


    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by this browser."
        );

        return;
    }


    if (locationButton) {

        locationButton.textContent =
            "Getting Location...";

    }


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "Latitude:",
                latitude
            );

            console.log(
                "Longitude:",
                longitude
            );


            lastSOSLocation =
                `${latitude}, ${longitude}`;


            if (locationInput) {

                locationInput.value =
                    lastSOSLocation;

            }


            if (locationButton) {

                locationButton.textContent =
                    "✓ Location Received";

            }

        },

        function (error) {

            console.error(
                "Location error:",
                error
            );


            alert(
                "Unable to get your location. Please allow location access."
            );


            if (locationButton) {

                locationButton.textContent =
                    "Get Location";

            }

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

}


// ==========================================
// SOS FORM
// ==========================================

const sosForm =
    document.getElementById("sosForm");

if (sosForm) {

    sosForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            console.log(
                "🚨 SOS FORM SUBMITTED"
            );


            const location =
                locationInput
                    ? locationInput.value.trim()
                    : "";


            lastSOSLocation =
                location;


            const reason =
                document
                    .getElementById("reason")
                    .value
                    .trim();


            const people =
                document
                    .getElementById("people")
                    .value;


            const helpType =
                document
                    .getElementById("helpType")
                    .value;


            // ==================================
            // VALIDATION
            // ==================================

            if (!location) {

                alert(
                    "Please get your location before submitting the SOS."
                );

                return;
            }


            if (!reason) {

                alert(
                    "Please describe your emergency."
                );

                return;
            }


            if (!people || Number(people) < 1) {

                alert(
                    "Please enter the number of people."
                );

                return;
            }


            if (!helpType) {

                alert(
                    "Please select the type of help required."
                );

                return;
            }


            // ==================================
            // SOS DATA
            // ==================================

            const sosData = {

                userName:
                    currentUser
                        ? currentUser.name
                        : "Unknown",

                userMobile:
                    currentUser
                        ? currentUser.mobile
                        : "Unknown",

                identityVerified:
                    currentUser
                        ? currentUser.identityVerified
                        : false,

                location:
                    location,

                reason:
                    reason,

                people:
                    Number(people),

                helpType:
                    helpType,

                status:
                    "PENDING",

                timestamp:
                    new Date().toISOString()

            };


            console.log(
                "📤 Sending SOS data:",
                sosData
            );


            // ==================================
            // SEND SOS TO LIVE BACKEND
            // ==================================

            try {

                const SOS_API_URL =
                    `${API_BASE_URL}/api/sos`;


                console.log(
                    "🌐 Sending SOS to:",
                    SOS_API_URL
                );


                const response =
                    await fetch(
                        SOS_API_URL,
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body:
                                JSON.stringify(
                                    sosData
                                )

                        }
                    );


                console.log(
                    "📡 Server status:",
                    response.status
                );


                const responseText =
                    await response.text();


                console.log(
                    "📥 Server response:",
                    responseText
                );


                if (!response.ok) {

                    throw new Error(
                        `Server returned ${response.status}: ${responseText}`
                    );

                }


                let result;


                try {

                    result =
                        JSON.parse(
                            responseText
                        );

                } catch (jsonError) {

                    throw new Error(
                        "Server returned an invalid response."
                    );

                }


                console.log(
                    "✅ SOS response:",
                    result
                );


                if (result.success) {

                    alert(
                        "🚨 SOS sent successfully!"
                    );


                    const confirmation =
                        document.getElementById(
                            "confirmation"
                        );


                    if (confirmation) {

                        confirmation.classList.remove(
                            "hidden"
                        );

                    }


                    const requestIdElement =
                        document.getElementById(
                            "requestId"
                        );


                    if (requestIdElement) {

                        requestIdElement.textContent =
                            "Request ID: " +
                            result.requestId;

                    }


                    const mapButton =
                        document.getElementById(
                            "mapButton"
                        );


                    if (mapButton) {

                        mapButton.classList.remove(
                            "hidden"
                        );

                    }


                    sosForm.reset();


                    if (locationInput) {

                        locationInput.value =
                            "";

                    }


                    if (confirmation) {

                        confirmation.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                } else {

                    throw new Error(
                        result.message ||
                        "SOS could not be sent."
                    );

                }

            }

            catch (error) {

                console.error(
                    "❌ SOS SENDING ERROR:",
                    error
                );


                alert(
                    "SOS could not be sent.\n\n" +
                    error.message
                );

            }

        }
    );

}


// ==========================================
// PROFILE
// ==========================================

function loadProfile() {

    if (!currentUser) {

        return;
    }


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileMobile =
        document.getElementById(
            "profileMobile"
        );


    if (profileName) {

        profileName.textContent =
            currentUser.name;

    }


    if (profileMobile) {

        profileMobile.textContent =
            currentUser.mobile;

    }

}


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "adrnUser"
            );


            currentUser = null;


            if (appScreen) {

                appScreen.classList.add(
                    "hidden"
                );

            }


            if (loginScreen) {

                loginScreen.classList.remove(
                    "hidden"
                );

            }


            console.log(
                "👋 User logged out"
            );

        }
    );

}


// ==========================================
// OPEN LOCATION IN GOOGLE MAPS
// ==========================================

const mapButton =
    document.getElementById("mapButton");


if (mapButton) {

    mapButton.addEventListener(
        "click",
        function () {

            if (!lastSOSLocation) {

                alert(
                    "Location is not available."
                );

                return;
            }


            const coordinates =
                lastSOSLocation.split(",");


            if (coordinates.length < 2) {

                alert(
                    "Invalid location coordinates."
                );

                return;
            }


            const latitude =
                coordinates[0].trim();

            const longitude =
                coordinates[1].trim();


            const mapsURL =
                `https://www.google.com/maps?q=${latitude},${longitude}`;


            console.log(
                "📍 Opening Google Maps:",
                mapsURL
            );


            window.open(
                mapsURL,
                "_blank"
            );

        }
    );

}


// ==========================================
// DEBUG INFORMATION
// ==========================================

console.log(
    "🚑 ADRN application loaded."
);

console.log(
    "🌐 Backend:",
    API_BASE_URL
);

console.log(
    "🚨 SOS endpoint:",
    `${API_BASE_URL}/api/sos`
);
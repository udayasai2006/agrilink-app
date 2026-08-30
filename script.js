var currentLanguage = "en",
  activeService = 0,
  authMode = "signin",
  currentUser = { name: "Ramesh", district: "Guntur" },
  historyCount = 11,
  watchId = null;

var icons = ["🚚", "🛡️", "₹", "🆘", "🗺️", "📅", "🌾", "🤝"];

var names = {
  en: [
    "Shared Transport",
    "Buyer Reliability",
    "True Profit Calculator",
    "Rescue My Harvest",
    "Oversupply Map",
    "Harvest-Time Advisor",
    "Crop Details",
    "Automatic Buyer Matching",
  ],
  te: [
    "రవాణా వాహనాన్ని పంచుకోండి",
    "కొనుగోలుదారు నమ్మకాన్ని చూడండి",
    "నిజమైన లాభాన్ని లెక్కించండి",
    "నా పంటను రక్షించండి",
    "అధిక పంట సరఫరా హెచ్చరిక",
    "ఉత్తమ కోత సమయ సలహా",
    "పంట వివరాలు",
    "ఆటోమేటిక్ కొనుగోలుదారు మ్యాచింగ్",
  ],
  hi: [
    "साझा परिवहन",
    "खरीदार की विश्वसनीयता",
    "सही लाभ कैलकुलेटर",
    "मेरी फसल बचाएँ",
    "अधिक आपूर्ति नक्शा",
    "सही कटाई समय सलाह",
    "फसल की जानकारी",
    "स्वचालित खरीदार मिलान",
  ],
};

var descriptions = {
  en: [
    "Pool nearby farmers and reduce delivery cost.",
    "Check payment history, cancellations and reviews.",
    "Know real profit after every farming cost.",
    "Find verified buyers after a cancellation.",
    "Check local crop supply before sowing.",
    "Use maturity, weather, prices and demand.",
    "See duration, investment, yield and profit.",
    "Enter crop details and instantly find suitable verified buyers.",
  ],
  te: [
    "సమీప రైతులతో వాహనం పంచుకొని ఖర్చు తగ్గించండి.",
    "చెల్లింపు చరిత్ర, రద్దులు మరియు సమీక్షలను చూడండి.",
    "అన్ని ఖర్చుల తర్వాత అసలు లాభాన్ని తెలుసుకోండి.",
    "రద్దు అయినప్పుడు కొత్త కొనుగోలుదారులను కనుగొనండి.",
    "విత్తే ముందు స్థానిక పంట సరఫరాను చూడండి.",
    "వాతావరణం, ధర మరియు డిమాండ్‌తో కోత సమయం తెలుసుకోండి.",
    "పంట కాలం, పెట్టుబడి, దిగుబడి మరియు లాభాన్ని తెలుసుకోండి.",
    "పంట వివరాలు నమోదు చేసి సరైన కొనుగోలుదారులను కనుగొనండి.",
  ],
  hi: [
    "पास के किसानों के साथ वाहन साझा करके खर्च कम करें।",
    "भुगतान इतिहास, रद्दीकरण और समीक्षाएँ देखें।",
    "सभी खर्चों के बाद असली लाभ जानें।",
    "रद्द होने पर सत्यापित नया खरीदार खोजें।",
    "बुवाई से पहले स्थानीय फसल आपूर्ति देखें।",
    "मौसम, कीमत और मांग से कटाई समय जानें।",
    "अवधि, निवेश, उपज और लाभ देखें।",
    "फसल की जानकारी भरकर सही खरीदार तुरंत खोजें।",
  ],
};

var fields = {
  en: [
    ["Crop name", "Quantity (kg)", "Pickup village", "Delivery market", "Harvest date"],
    ["Buyer name", "District"],
    ["Land size (acres)", "Expected yield", "Selling price", "Total cost"],
    ["Crop name", "Available quantity", "Minimum price", "Freshness remaining", "Pickup village"],
    ["Planned crop", "Land size (acres)", "District", "Sowing month"],
    ["Crop name", "Sowing date", "Crop stage", "Farm location"],
    ["Crop name", "Land size (acres)", "Season", "Irrigation"],
    ["Crop name", "Quantity (kg)", "Grade", "Location", "Harvest time"],
  ],
  te: [
    ["పంట పేరు", "పరిమాణం", "పికప్ గ్రామం", "మార్కెట్", "కోత తేదీ"],
    ["కొనుగోలుదారు పేరు", "జిల్లా"],
    ["భూమి (ఎకరాలు)", "అంచనా దిగుబడి", "అమ్మకపు ధర", "మొత్తం ఖర్చు"],
    ["పంట పేరు", "అందుబాటులో ఉన్న పరిమాణం", "కనీస ధర", "తాజాదనం సమయం", "పికప్ గ్రామం"],
    ["వేయాలనుకున్న పంట", "భూమి (ఎకరాలు)", "జిల్లా", "విత్తే నెల"],
    ["పంట పేరు", "విత్తిన తేదీ", "పంట దశ", "పొలం ప్రాంతం"],
    ["పంట పేరు", "భూమి (ఎకరాలు)", "కాలం", "నీటిపారుదల"],
    ["పంట పేరు", "పరిమాణం (కిలోలు)", "గ్రేడ్", "ప్రాంతం", "కోతకు మిగిలిన సమయం"],
  ],
  hi: [
    ["फसल का नाम", "मात्रा", "उठाने का गाँव", "बिक्री बाजार", "कटाई की तारीख"],
    ["खरीदार का नाम", "जिला"],
    ["भूमि (एकड़)", "अनुमानित उपज", "बिक्री मूल्य", "कुल लागत"],
    ["फसल का नाम", "उपलब्ध मात्रा", "न्यूनतम कीमत", "ताजगी का समय", "उठाने का गाँव"],
    ["योजनाबद्ध फसल", "भूमि (एकड़)", "जिला", "बुवाई का महीना"],
    ["फसल का नाम", "बुवाई की तारीख", "फसल की अवस्था", "खेत का स्थान"],
    ["फसल का नाम", "मात्रा (किलो)", "ग्रेड", "स्थान", "कटाई में बचा समय"],
  ],
};

var ui = {
  en: {
    tag: "Smart farming. Fair prices. Better lives.",
    intro: "Every farming decision, made simpler in your language.",
    welcome: "Welcome to AgriLink AI",
    safe: "Login safely using your account details",
    tabSignIn: "Sign In",
    tabSignUp: "Sign Up",
    fullName: "Full Name",
    district: "District",
    mobile: "Mobile number",
    password: "Password",
    confirmPassword: "Confirm Password",
    btnSignIn: "Sign In",
    btnSignUp: "Create Account",
    guest: "Continue as Guest",
    signOut: "Sign Out",
    location: "Location & Language",
    choose: "Choose your language. You can change it later.",
    detected: "DETECTED LOCATION",
    place: "Hyderabad, Telangana",
    suggest: "We detected Telangana. Continue in Telugu?",
    yes: "Yes, continue in Telugu",
    other: "Choose another language",
    hello: "Namaste, ",
    question: "What would you like to do today?",
    services: "Everything your farm needs",
    tap: "Tap any card to get started",
    open: "Open service",
    tip: "Today’s farming tip",
    tipText: "Light rain is expected tomorrow. Complete spraying before 3 PM.",
    back: "Back to services",
    enter: "Enter your details",
    show: "Show Result",
    empty: "Your result will appear here",
    complete: "Analysis complete",
    yourResult: "Your Result",
    dbTag: "Saved in database as history record #",
  },
  te: {
    tag: "తెలివైన వ్యవసాయం. సరైన ధర. మెరుగైన జీవితం.",
    intro: "మీ భాషలో వ్యవసాయ నిర్ణయాలను సులభంగా తీసుకోండి.",
    welcome: "AgriLink AIకి స్వాగతం",
    safe: "మీ వివరాలతో సురక్షితంగా లాగిన్ అవ్వండి",
    tabSignIn: "సైన్ ఇన్",
    tabSignUp: "సైన్ అప్",
    fullName: "పూర్తి పేరు",
    district: "జిల్లా",
    mobile: "మొబైల్ నంబర్",
    password: "పాస్‌వర్డ్",
    confirmPassword: "పాస్‌వర్డ్‌ను నిర్ధారించండి",
    btnSignIn: "సైన్ ఇన్",
    btnSignUp: "ఖాతాను సృష్టించండి",
    guest: "అతిథిగా కొనసాగండి",
    signOut: "లాగ్ అవుట్",
    location: "స్థానం మరియు భాష",
    choose: "మీ భాషను ఎంచుకోండి. తర్వాత కూడా మార్చుకోవచ్చు.",
    detected: "గుర్తించిన స్థానం",
    place: "హైదరాబాద్, తెలంగాణ",
    suggest: "తెలుగులో కొనసాగాలనుకుంటున్నారా?",
    yes: "అవును, తెలుగులో కొనసాగండి",
    other: "మరొక భాషను ఎంచుకోండి",
    hello: "నమస్కారం, ",
    question: "ఈ రోజు మీరు ఏమి చేయాలనుకుంటున్నారు?",
    services: "మీ వ్యవసాయానికి కావాల్సిన అన్ని సేవలు",
    tap: "ప్రారంభించడానికి కార్డును నొక్కండి",
    open: "సేవను తెరవండి",
    tip: "నేటి వ్యవసాయ సూచన",
    tipText: "రేపు తేలికపాటి వర్షం పడవచ్చు. ఈ రోజు 3 గంటలలోపు పిచికారీ పూర్తి చేయండి.",
    back: "సేవలకు తిరిగి",
    enter: "మీ వివరాలను నమోదు చేయండి",
    show: "ఫలితం చూపించు",
    empty: "మీ ఫలితం ఇక్కడ కనిపిస్తుంది",
    complete: "విశ్లేషణ పూర్తయింది",
    yourResult: "మీ ఫలితం",
    dbTag: "డేటాబేస్‌లో హిస్టరీ రికార్డ్ #గా సేవ్ చేయబడింది ",
  },
  hi: {
    tag: "स्मार्ट खेती। सही दाम। बेहतर जीवन।",
    intro: "खेती के फैसले अपनी भाषा में आसानी से लें।",
    welcome: "AgriLink AI में आपका स्वागत है",
    safe: "अपने विवरण से सुरक्षित लॉगिन करें",
    tabSignIn: "साइन इन",
    tabSignUp: "साइन अप",
    fullName: "पूरा नाम",
    district: "जिला",
    mobile: "मोबाइल नंबर",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    btnSignIn: "साइन इन",
    btnSignUp: "खाता बनाएँ",
    guest: "अतिथि के रूप में जारी रखें",
    signOut: "साइन आउट",
    location: "स्थान और भाषा",
    choose: "अपनी भाषा चुनें। बाद में भी बदल सकते हैं।",
    detected: "पता लगाया गया स्थान",
    place: "हैदराबाद, तेलंगाना",
    suggest: "क्या तेलुगु में जारी रखना चाहते हैं?",
    yes: "हाँ, तेलुगु में जारी रखें",
    other: "दूसरी भाषा चुनें",
    hello: "नमस्ते, ",
    question: "आज आप क्या करना चाहते हैं?",
    services: "आपकी खेती के लिए सभी सेवाएँ",
    tap: "शुरू करने के लिए कार्ड चुनें",
    open: "सेवा खोलें",
    tip: "आज की खेती सलाह",
    tipText: "कल हल्की बारिश हो सकती है। आज 3 बजे से पहले छिड़काव पूरा करें।",
    back: "सेवाओं पर वापस",
    enter: "अपनी जानकारी भरें",
    show: "परिणाम दिखाएँ",
    empty: "आपका परिणाम यहाँ दिखाई देगा",
    complete: "विश्लेषण पूरा हुआ",
    yourResult: "आपका परिणाम",
    dbTag: "डेटाबेस में इतिहास रिकॉर्ड के रूप में सहेजा गया #",
  },
};

function byId(id) {
  return document.getElementById(id);
}

function text(id, val) {
  if (byId(id)) byId(id).textContent = val;
}

function detectExactLocation() {
  var placeTextEl = byId("placeText");
  var suggestTextEl = byId("suggestText");

  if (!navigator.geolocation) return;

  if (placeTextEl) placeTextEl.textContent = "Detecting live location...";

  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }

  watchId = navigator.geolocation.watchPosition(
    async function (position) {
      var lat = position.coords.latitude;
      var lon = position.coords.longitude;

      try {
        var response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
        );
        var data = await response.json();

        var address = data.address || {};
        var cityOrTown =
          address.village ||
          address.town ||
          address.suburb ||
          address.city ||
          address.county ||
          "Surampalem";
        var state = address.state || "Andhra Pradesh";

        var detectedString = `${cityOrTown}, ${state}`;

        if (placeTextEl) placeTextEl.textContent = detectedString;
        if (suggestTextEl) {
          suggestTextEl.textContent = `We detected ${state}. Continue in Telugu?`;
        }
      } catch (err) {
        if (placeTextEl && placeTextEl.textContent.includes("Detecting")) {
          placeTextEl.textContent = "Surampalem, Andhra Pradesh";
        }
      }
    },
    function (error) {
      if (placeTextEl && placeTextEl.textContent.includes("Detecting")) {
        placeTextEl.textContent = "Surampalem, Andhra Pradesh";
      }
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
  );
}

function renderAuthForm() {
  var container = byId("authFields");
  var u = ui[currentLanguage];
  if (!container) return;

  var html = "";
  if (authMode === "signup") {
    html += '<label>' + u.fullName + '<input required type="text" id="authName" placeholder="e.g. Ramesh Reddy"></label>';
    html += '<label>' + u.district + '<input required type="text" id="authDistrict" placeholder="e.g. Guntur"></label>';
  }
  html += '<label>' + u.mobile + '<input required type="tel" id="authMobile" placeholder="+91 98765 43210"></label>';
  html += '<label>' + u.password + '<input required type="password" id="authPass" placeholder="••••••••"></label>';

  if (authMode === "signup") {
    html += '<label>' + u.confirmPassword + '<input required type="password" id="authPassConfirm" placeholder="••••••••"></label>';
  }

  container.innerHTML = html;
  text("authSubmitBtn", authMode === "signin" ? u.btnSignIn : u.btnSignUp);
}

function switchAuthTab(mode) {
  authMode = mode;
  byId("tabSignIn").classList.toggle("active", mode === "signin");
  byId("tabSignUp").classList.toggle("active", mode === "signup");
  renderAuthForm();
}

function handleAuthSubmit(e) {
  e.preventDefault();
  var nameInput = byId("authName");
  var distInput = byId("authDistrict");

  if (authMode === "signup" && nameInput && nameInput.value.trim() !== "") {
    currentUser.name = nameInput.value.trim();
    if (distInput && distInput.value.trim() !== "") {
      currentUser.district = distInput.value.trim();
    }
  } else if (!currentUser.name) {
    currentUser.name = "Ramesh";
  }

  showScreen("setup");
}

function handleSignOut() {
  currentUser.name = "";
  showScreen("login");
}

function updateHeroGreeting() {
  var u = ui[currentLanguage];
  var displayName = currentUser.name && currentUser.name.trim() !== "" ? currentUser.name : "Farmer";
  text("hello", u.hello + displayName + "!");
}

function renderScreen(id, serviceIdx) {
  document.querySelectorAll(".screen").forEach(function (s) {
    s.classList.add("hidden");
  });
  var screen = byId(id);
  if (screen) screen.classList.remove("hidden");

  if (id === "setup") detectExactLocation();

  if (id === "dashboard") {
    updateHeroGreeting();
    buildCards();
  }
  if (id === "service" && typeof serviceIdx !== "undefined") {
    renderServiceDetails(serviceIdx);
  }
}

function showScreen(id, pushHistory = true) {
  renderScreen(id);
  if (pushHistory) {
    history.pushState({ screenId: id }, "", "#" + id);
  }
}

window.onpopstate = function (event) {
  if (event.state && event.state.screenId) {
    renderScreen(event.state.screenId, event.state.serviceIdx);
  } else {
    renderScreen("login");
  }
};

function changeLanguage(language) {
  currentLanguage = language;
  
  ["langSelect", "langSelectDetail"].forEach(function(sId) {
    var select = byId(sId);
    if (select) select.value = language;
  });

  var x = ui[language];
  text("tagline", x.tag);
  text("introText", x.intro);
  text("welcome", x.welcome);
  text("safeText", x.safe);
  text("tabSignIn", x.tabSignIn);
  text("tabSignUp", x.tabSignUp);
  text("guestBtn", x.guest);
  text("locationTitle", x.location);
  text("chooseText", x.choose);
  text("detectedLabel", x.detected);
  
  if (!byId("placeText").textContent.includes(",")) {
    text("placeText", x.place);
  }
  
  text("suggestText", x.suggest);
  text("yesBtn", x.yes);
  text("otherBtn", x.other);
  
  document.querySelectorAll(".signOut").forEach(function(btn) {
    btn.textContent = x.signOut;
  });

  text("question", x.question);
  text("servicesTitle", x.services);
  text("tapText", x.tap);
  text("tipTitle", x.tip);
  text("tipText", x.tipText);
  text("backBtn", "← " + x.back);
  text("enterTitle", x.enter);
  text("resultBtn", x.show);
  text("emptyText", x.empty);

  renderAuthForm();
  updateHeroGreeting();
  buildCards();
}

function continueTelugu() {
  changeLanguage("te");
  showScreen("dashboard");
}

function buildCards() {
  var grid = byId("serviceGrid");
  if (!grid) return;
  var html = "";
  names[currentLanguage].forEach(function (name, i) {
    html +=
      '<button class="card" onclick="openService(' +
      i +
      ')"><span class="icon">' +
      icons[i] +
      "</span><h3>" +
      name +
      "</h3><p>" +
      descriptions[currentLanguage][i] +
      "</p><b>" +
      ui[currentLanguage].open +
      " →</b></button>";
  });
  grid.innerHTML = html;
}

function renderServiceDetails(i) {
  activeService = i;
  text("serviceIcon", icons[i]);
  text("serviceName", names[currentLanguage][i]);
  text("serviceDescription", descriptions[currentLanguage][i]);
  var html = "";
  fields[currentLanguage][i].forEach(function (label, index) {
    var val = i === 7 ? ["Tomato", "2000", "A", currentUser.district || "Ongole", "2 days"][index] : "";
    html +=
      "<label>" +
      label +
      '<input required id="input_' +
      index +
      '" value="' +
      val +
      '" placeholder="' +
      label +
      '"></label>';
  });
  byId("formFields").innerHTML = html;
  text("enterTitle", ui[currentLanguage].enter);
  text("resultBtn", ui[currentLanguage].show);
  byId("resultBox").innerHTML =
    '<div class="empty">🌱<h3>' + ui[currentLanguage].empty + "</h3></div>";
}

function openService(i) {
  renderScreen("service", i);
  history.pushState({ screenId: "service", serviceIdx: i }, "", "#service-" + i);
}

// Service form submission handler
byId("serviceForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  byId("resultBox").innerHTML = '<div class="empty">⏳<h3>Analyzing data...</h3></div>';

  const BACKEND_URL = "https://agrilink-app-2exr.onrender.com";
  historyCount++;

  function getVal(idx) {
    var el = byId("input_" + idx);
    return el ? el.value : "";
  }

  try {
    let response, data;

    switch (activeService) {
      case 0: // Shared Transport
        response = await fetch(`${BACKEND_URL}/api/shared-transport`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop: getVal(0),
            quantity: getVal(1),
            pickup_village: getVal(2),
          }),
        });
        break;

      case 1: // Buyer Reliability
      case 7: // Automatic Buyer Matching
        response = await fetch(
          `${BACKEND_URL}/api/buyers?buyer=${encodeURIComponent(getVal(0))}&district=${encodeURIComponent(getVal(1) || getVal(3))}`
        );
        break;

      case 2: // True Profit Calculator
        response = await fetch(`${BACKEND_URL}/api/profit-calculator`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            acres: getVal(0),
            expected_yield: getVal(1),
            selling_price: getVal(2),
            total_cost: getVal(3),
          }),
        });
        break;

      case 3: // Rescue My Harvest
        response = await fetch(`${BACKEND_URL}/api/rescue-harvest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop: getVal(0),
            quantity: getVal(1),
            min_price: getVal(2),
          }),
        });
        break;

      case 4: // Oversupply Map
        response = await fetch(`${BACKEND_URL}/api/oversupply-map`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            crop: getVal(0),
            district: getVal(2),
          }),
        });
        break;

      case 5: // Harvest-Time Advisor
        response = await fetch(`${BACKEND_URL}/api/harvest-advisor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sowing_date: getVal(1),
            stage: getVal(2),
          }),
        });
        break;

      case 6: // Crop Details
        response = await fetch(
          `${BACKEND_URL}/api/market-prices?crop=${encodeURIComponent(getVal(0) || "Tomato")}`
        );
        break;
    }

    if (!response || !response.ok) throw new Error("API call failed");
    data = await response.json();

    var html =
      '<div class="analysis"><b class="success">✓ ' +
      ui[currentLanguage].complete +
      "</b><h2>" +
      ui[currentLanguage].yourResult +
      "</h2>";

    if (Array.isArray(data)) {
      if (activeService === 1 || activeService === 7) {
        data.forEach(function (buyer, idx) {
          let badge = idx === 0 ? "🥇 " : idx === 1 ? "🥈 " : "🥉 ";
          html +=
            '<div class="row"><span>' +
            badge +
            (buyer.buyer_name || buyer.name) +
            " (" +
            buyer.location +
            ')</span><b>Score: ' +
            buyer.reliability_score +
            "% | Rating: " +
            buyer.payment_rating +
            "★</b></div>";
        });
      } else {
        data.forEach(function (mkt) {
          html +=
            '<div class="row"><span>' +
            mkt.market +
            "</span><b>₹" +
            mkt.price_per_kg +
            "/kg (Arrival: " +
            mkt.arrival_quantity +
            " kg)</b></div>";
        });
      }
    } else if (data.data) {
      data.data.forEach(function (row) {
        html +=
          '<div class="row"><span>' +
          row.label +
          "</span><b>" +
          row.value +
          "</b></div>";
      });
    }

    html += '<p class="note">' + ui[currentLanguage].dbTag + historyCount + '</p></div>';
    byId("resultBox").innerHTML = html;
  } catch (err) {
    byId("resultBox").innerHTML =
      '<div class="analysis"><b class="error">❌ Unable to fetch live feature analysis. Please check network.</b></div>';
  }
});

history.replaceState({ screenId: "login" }, "", "#login");
changeLanguage("en");

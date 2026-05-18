/* ═══════════════════════════════════════
   CURRENT DATE
═══════════════════════════════════════ */

function setCurrentDate(){

  const el =
    document.getElementById("currentDate");

  if(!el) return;

  const now = new Date();

  const options = {
    weekday:"long",
    year:"numeric",
    month:"long",
    day:"numeric"
  };

  el.textContent =
    now.toLocaleDateString(
      "en-IN",
      options
    );

}

setCurrentDate();


/* ═══════════════════════════════════════
   PROFILE DROPDOWN
═══════════════════════════════════════ */

const profileBtn =
  document.getElementById("profileBtn");

const profileDropdown =
  document.getElementById("profileDropdown");

if(profileBtn && profileDropdown){

  profileBtn.addEventListener("click",(e)=>{

    e.stopPropagation();

    profileDropdown.style.display =
      profileDropdown.style.display === "block"
      ? "none"
      : "block";

  });

  window.addEventListener("click",(e)=>{

    if(
      !profileBtn.contains(e.target)
      &&
      !profileDropdown.contains(e.target)
    ){

      profileDropdown.style.display = "none";

    }

  });

}


/* ═══════════════════════════════════════
   PAGE TABS
═══════════════════════════════════════ */

function switchTab(page,tab,btn){

  const pageEl =
    document.getElementById(
      `page-${page}`
    );

  pageEl
    .querySelectorAll(".tab-panel")
    .forEach(panel=>{
      panel.classList.remove("active");
    });

  const target =
    document.getElementById(
      `${page}-${tab}`
    );

  if(target){

    target.classList.add("active");

  }

  const tabBar =
    document.getElementById(
      `tabs-${page}`
    );

  tabBar
    .querySelectorAll(".page-tab")
    .forEach(tabBtn=>{
      tabBtn.classList.remove("active");
    });

  btn.classList.add("active");

}


/* ═══════════════════════════════════════
   BELL BUTTON
═══════════════════════════════════════ */

const bellBtn =
  document.getElementById("bellBtn");

if(bellBtn){

  bellBtn.addEventListener("click",()=>{

    alert("Notifications");

  });

}


/* ═══════════════════════════════════════
   CALENDAR SYSTEM
═══════════════════════════════════════ */

const monthNames = [
  "January","February","March","April",
  "May","June","July","August",
  "September","October","November","December"
];

const today = new Date();

let currentMonth =
  today.getMonth();

let currentYear =
  today.getFullYear();

const events = {
  5:"Math Assignment",
  11:"DBMS Quiz",
  19:"Project Review",
  24:"Internal Exam"
};

function renderCalendar(){

  const calendarGrid =
    document.getElementById("calendarGrid");

  const calendarTitle =
    document.getElementById("calendarTitle");

  if(!calendarGrid || !calendarTitle) return;

  calendarGrid.innerHTML = "";

  calendarTitle.innerText =
    `${monthNames[currentMonth]} ${currentYear}`;

  const firstDay =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

  const dayNames = [
    "Sun","Mon","Tue",
    "Wed","Thu","Fri","Sat"
  ];

  dayNames.forEach(day=>{

    const dayName =
      document.createElement("div");

    dayName.className =
      "cal-day-name";

    dayName.innerText = day;

    calendarGrid.appendChild(dayName);

  });

  for(let i=0;i<firstDay;i++){

    const empty =
      document.createElement("div");

    empty.className =
      "cal-day other";

    calendarGrid.appendChild(empty);

  }

  for(let day=1;day<=daysInMonth;day++){

    const date =
      document.createElement("div");

    date.className = "cal-day";

    date.innerText = day;

    if(
      day === today.getDate()
      &&
      currentMonth === today.getMonth()
      &&
      currentYear === today.getFullYear()
    ){

      date.classList.add("today");

    }

    if(events[day]){

      date.classList.add("has-event");

      date.title = events[day];

    }

    calendarGrid.appendChild(date);

  }

}

renderCalendar();


/* ═══════════════════════════════════════
   THEME MODE
═══════════════════════════════════════ */

const darkBtn =
  document.getElementById("darkMode");

const lightBtn =
  document.getElementById("lightMode");

/* APPLY SAVED THEME */

if(localStorage.getItem("theme") === "dark"){

  document.body.classList.add("dark-mode");

}

/* DARK MODE */

if(darkBtn){

  darkBtn.onclick = ()=>{

    document.body.classList.add("dark-mode");

    localStorage.setItem(
      "theme",
      "dark"
    );

  };

}

/* LIGHT MODE */

if(lightBtn){

  lightBtn.onclick = ()=>{

    document.body.classList.remove(
      "dark-mode"
    );

    localStorage.setItem(
      "theme",
      "light"
    );

  };

}



/* ═══════════════════════════════════════
   ABOUT MODAL
═══════════════════════════════════════ */

function openAboutModal(){

  const modal =
    document.getElementById(
      "aboutOverlay"
    );

  if(modal){

    modal.classList.add("open");

    document.body.style.overflow =
      "hidden";

  }

}

function closeAboutModal(){

  const modal =
    document.getElementById(
      "aboutOverlay"
    );

  if(modal){

    modal.classList.remove("open");

    document.body.style.overflow = "";

  }

}



/* CLOSE ON OUTSIDE CLICK */

window.addEventListener("click",(e)=>{

  const modal =
    document.getElementById(
      "aboutOverlay"
    );

  if(e.target === modal){

    closeAboutModal();

  }

});



/* CLOSE ON ESC */

document.addEventListener("keydown",(e)=>{

  if(e.key === "Escape"){

    closeAboutModal();

  }

});



/* ═══════════════════════════════════════
   MODAL TABS
═══════════════════════════════════════ */

function switchInfoTab(page,btn){

  document
    .querySelectorAll(".info-page")
    .forEach(infoPage=>{
      infoPage.style.display = "none";
    });

  document
    .querySelectorAll(".info-tab")
    .forEach(tab=>{
      tab.classList.remove("active");
    });

  const targetPage =
    document.getElementById(
      `${page}Page`
    );

  if(targetPage){

    targetPage.style.display =
      "block";

  }

  btn.classList.add("active");

}
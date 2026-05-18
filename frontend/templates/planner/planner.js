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

  document
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

  document
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

    localStorage.setItem("theme","dark");

  };

}

/* LIGHT MODE */

if(lightBtn){

  lightBtn.onclick = ()=>{

    document.body.classList.remove("dark-mode");

    localStorage.setItem("theme","light");

  };

}


/* ═══════════════════════════════════════
   ABOUT MODAL
═══════════════════════════════════════ */

function openAboutModal(){

  const modal =
    document.getElementById("aboutOverlay");

  if(modal){

    modal.classList.add("open");

    document.body.style.overflow = "hidden";

  }

}

function closeAboutModal(){

  const modal =
    document.getElementById("aboutOverlay");

  if(modal){

    modal.classList.remove("open");

    document.body.style.overflow = "";

  }

}


/* CLOSE ON OUTSIDE CLICK */

window.addEventListener("click",(e)=>{

  const modal =
    document.getElementById("aboutOverlay");

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

    targetPage.style.display = "block";

  }

  btn.classList.add("active");

}
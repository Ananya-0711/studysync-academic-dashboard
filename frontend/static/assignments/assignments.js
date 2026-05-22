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

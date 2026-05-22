/* ── THEME MODE ── */
const darkBtn = document.getElementById("darkMode");
const lightBtn = document.getElementById("lightMode");

if(localStorage.getItem("theme") === "dark"){
  document.body.classList.add("dark-mode");
}
if(darkBtn){
  darkBtn.onclick = ()=>{
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme","dark");
  };
}
if(lightBtn){
  lightBtn.onclick = ()=>{
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme","light");
  };
}

/* ── ABOUT MODAL ── */
function openAboutModal(){
  const modal = document.getElementById("aboutOverlay");
  if(modal){
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}
function closeAboutModal(){
  const modal = document.getElementById("aboutOverlay");
  if(modal){
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}
window.addEventListener("click",(e)=>{
  const modal = document.getElementById("aboutOverlay");
  if(e.target === modal) closeAboutModal();
});
document.addEventListener("keydown",(e)=>{
  if(e.key === "Escape") closeAboutModal();
});
function switchInfoTab(page,btn){
  document.querySelectorAll(".info-page").forEach(infoPage=>{
    infoPage.style.display = "none";
  });
  document.querySelectorAll(".info-tab").forEach(tab=>{
    tab.classList.remove("active");
  });
  const targetPage = document.getElementById(`${page}Page`);
  if(targetPage) targetPage.style.display = "block";
  btn.classList.add("active");
}

/* SAVE BUTTON FEEDBACK */
const btnSave = document.querySelector('.btn-save');
if(btnSave) {
  btnSave.addEventListener('click', () => {
    btnSave.innerHTML = '<i class="fa-solid fa-circle-check"></i> Saved!';
    btnSave.style.background = 'linear-gradient(135deg, #059669, #10B981)';
    setTimeout(() => {
      btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Semester Setup';
      btnSave.style.background = '';
    }, 2200);
  });
}

/* ── CURRENT DATE ── */
function setCurrentDate() {
  const el = document.getElementById('currentDate');
  if (!el) return;
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  el.textContent = now.toLocaleDateString('en-IN', options);
}
setCurrentDate();

/* ── BELL NOTIFICATIONS SCROLL ── */
const dashBellBtn = document.getElementById('bellBtn');
if (dashBellBtn) {
  dashBellBtn.addEventListener('click', () => {
    const notifSection = document.querySelector('.bottom-right');
    if (notifSection) {
      notifSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
}

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

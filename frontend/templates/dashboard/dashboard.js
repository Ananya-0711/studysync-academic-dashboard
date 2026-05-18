// ═══════════════════════════════════════
//   dashboard.js — StudySync Dashboard
// ═══════════════════════════════════════

/* ── CURRENT DATE ── */

function setCurrentDate() {
  const el = document.getElementById('currentDate');
  if (!el) return;

  const now = new Date();
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  el.textContent = now.toLocaleDateString('en-IN', options);
}

setCurrentDate();

/* ── PROFILE DROPDOWN ── */

const profileBtn =
document.getElementById("profileBtn");

const profileDropdown =
document.getElementById("profileDropdown");

/* TOGGLE DROPDOWN */

profileBtn.addEventListener("click", () => {

    if(
        profileDropdown.style.display === "block"
    ){

        profileDropdown.style.display = "none";

    }

    else{

        profileDropdown.style.display = "block";

    }

});

window.addEventListener("click", (e) => {

    if(
        !profileBtn.contains(e.target)
        &&
        !profileDropdown.contains(e.target)
    ){

        profileDropdown.style.display = "none";

    }

});


/* ══════════════════════════════════════
   CHART.JS — Attendance Doughnut
══════════════════════════════════════ */

const attendanceCtx = document
  .getElementById('attendanceChart')
  .getContext('2d');

new Chart(attendanceCtx, {
  type: 'doughnut',

  data: {
    labels: ['Attended', 'Missed'],
    datasets: [{
      data: [78, 22],
      backgroundColor: ['#7C3AED', '#EDE9FE'],
      borderColor:     ['#7C3AED', '#DDD6FE'],
      borderWidth: 2,
      hoverOffset: 6
    }]
  },

  options: {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '72%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(ctx) {
            return ` ${ctx.label}: ${ctx.parsed}%`;
          }
        },
        backgroundColor: '#1E1B4B',
        titleColor: '#fff',
        bodyColor: '#C4B5FD',
        padding: 10,
        borderRadius: 8
      }
    },
    animation: {
      animateRotate: true,
      duration: 900,
      easing: 'easeInOutQuart'
    }
  }
});

/* ══════════════════════════════════════
   CHART.JS — Study Hours Line Chart
══════════════════════════════════════ */

const studyCtx = document
  .getElementById('studyChart')
  .getContext('2d');

// Gradient fill
const studyGradient = studyCtx.createLinearGradient(0, 0, 0, 250);
studyGradient.addColorStop(0,   'rgba(124, 58, 237, 0.25)');
studyGradient.addColorStop(0.6, 'rgba(124, 58, 237, 0.05)');
studyGradient.addColorStop(1,   'rgba(124, 58, 237, 0)');

new Chart(studyCtx, {
  type: 'line',

  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Study Hours',
      data: [3.5, 4.0, 2.5, 5.0, 3.0, 4.5, 2.0],
      borderColor: '#7C3AED',
      backgroundColor: studyGradient,
      borderWidth: 2.5,
      fill: true,
      tension: 0.45,
      pointBackgroundColor: '#7C3AED',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7
    }]
  },

  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(ctx) {
            return ` ${ctx.parsed.y} hrs studied`;
          }
        },
        backgroundColor: '#1E1B4B',
        titleColor: '#fff',
        bodyColor: '#C4B5FD',
        padding: 10,
        borderRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            family: "'DM Sans', sans-serif",
            size: 12,
            weight: '500'
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 7,
        grid: {
          color: '#97b7f6',
          drawBorder: false
        },
        border: {
          display: false,
          dash: [4, 4]
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            family: "'DM Sans', sans-serif",
            size: 12
          },
          callback: function(val) {
            return val + 'h';
          },
          stepSize: 1
        }
      }
    },
    animation: {
      duration: 900,
      easing: 'easeInOutQuart'
    }
  }
});

/* ═══════════════════════════════════════
   BELL BUTTON - NOTIFICATIONS
═══════════════════════════════════════ */

const bellBtn = document.getElementById('bellBtn');

if (bellBtn) {

  bellBtn.addEventListener('click', () => {
  // Scroll to notifications section smoothly
  const notifSection = document.querySelector('.bottom-right');
  if (notifSection) {
    notifSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
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
// ═══════════════════════════════════════
//   setup.js — StudySync Setup Workspace
// ═══════════════════════════════════════

/* ──────────────────────────────────────
   PROFILE DROPDOWN
────────────────────────────────────── */

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


/* ──────────────────────────────────────
   SUBJECT DATA
────────────────────────────────────── */

// Track subjects for the slot modal dropdown
let subjects = [
  { name: 'Data Structures',    code: 'CS201', credits: 4, color: '#7C3AED', bg: '#EDE9FE', initials: 'DS' },
  { name: 'Database Management',code: 'CS202', credits: 3, color: '#4F46E5', bg: '#E0E7FF', initials: 'DB' },
  { name: 'Web Development',    code: 'CS203', credits: 3, color: '#0EA5E9', bg: '#E0F2FE', initials: 'WD' },
  { name: 'Operating Systems',  code: 'CS204', credits: 4, color: '#059669', bg: '#D1FAE5', initials: 'OS' },
];

/* Update subject count badge */
function updateSubjectCount() {
  const countEl = document.getElementById('subjectCount');
  if (countEl) {
    countEl.textContent = subjects.length + (subjects.length === 1 ? ' subject' : ' subjects');
  }
}

/* ──────────────────────────────────────
   SUBJECT MODAL
────────────────────────────────────── */

const subjectModal       = document.getElementById('subjectModal');
const addSubjectBtn      = document.getElementById('addSubjectBtn');
const closeSubjectModal  = document.getElementById('closeSubjectModal');
const cancelSubjectModal = document.getElementById('cancelSubjectModal');
const saveSubjectBtn     = document.getElementById('saveSubjectBtn');

// Open
addSubjectBtn.addEventListener('click', () => {
  subjectModal.classList.add('open');
  document.getElementById('subjectNameInput').focus();
});

// Close
function closeSubjectModalFn() {
  subjectModal.classList.remove('open');
  document.getElementById('subjectNameInput').value = '';
  document.getElementById('subjectCodeInput').value = '';
  document.getElementById('subjectCreditsInput').value = '';
}

closeSubjectModal.addEventListener('click', closeSubjectModalFn);
cancelSubjectModal.addEventListener('click', closeSubjectModalFn);

subjectModal.addEventListener('click', (e) => {
  if (e.target === subjectModal) closeSubjectModalFn();
});

// Save subject
saveSubjectBtn.addEventListener('click', () => {
  const name    = document.getElementById('subjectNameInput').value.trim();
  const code    = document.getElementById('subjectCodeInput').value.trim().toUpperCase();
  const credits = parseInt(document.getElementById('subjectCreditsInput').value);

  if (!name || !code || isNaN(credits)) {
    alert('Please fill in all fields.');
    return;
  }

  // Pick a color from palette
  const palette = [
    { color: '#7C3AED', bg: '#EDE9FE' },
    { color: '#4F46E5', bg: '#E0E7FF' },
    { color: '#0EA5E9', bg: '#E0F2FE' },
    { color: '#059669', bg: '#D1FAE5' },
    { color: '#D97706', bg: '#FEF3C7' },
    { color: '#DC2626', bg: '#FEE2E2' },
  ];

  const colorPick = palette[subjects.length % palette.length];

  // Initials from name
  const words    = name.split(' ');
  const initials = words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();

  // Add to data
  subjects.push({ name, code, credits, ...colorPick, initials });

  // Render card
  addSubjectCard({ name, code, credits, ...colorPick, initials });

  // Update slot modal dropdown
  updateSlotSubjectDropdown();

  // Update count
  updateSubjectCount();

  closeSubjectModalFn();
});

/* Render a subject card into the grid */
function addSubjectCard(sub) {
  const grid = document.getElementById('subjectsGrid');

  const card = document.createElement('div');
  card.className = 'subject-card';
  card.style.setProperty('--card-accent', sub.color);

  card.innerHTML = `
    <div class="subject-card-left">
      <div class="subject-initial" style="background:${sub.bg}; color:${sub.color};">${sub.initials}</div>
      <div class="subject-info">
        <span class="subject-name">${sub.name}</span>
        <span class="subject-code">${sub.code}</span>
      </div>
    </div>
    <div class="subject-card-right">
      <span class="credits-badge">${sub.credits} Credits</span>
      <div class="card-actions">
        <button class="action-btn edit-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="action-btn delete-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `;

  // Delete handler
  card.querySelector('.delete-btn').addEventListener('click', () => {
    card.style.transition = 'opacity 0.2s, transform 0.2s';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.96)';
    setTimeout(() => {
      card.remove();
      subjects = subjects.filter(s => s.code !== sub.code);
      updateSubjectCount();
      updateSlotSubjectDropdown();
    }, 200);
  });

  grid.appendChild(card);
}

/* ──────────────────────────────────────
   SLOT MODAL
────────────────────────────────────── */

const slotModal       = document.getElementById('slotModal');
const addSlotBtn      = document.getElementById('addSlotBtn');
const closeSlotModal  = document.getElementById('closeSlotModal');
const cancelSlotModal = document.getElementById('cancelSlotModal');
const saveSlotBtn     = document.getElementById('saveSlotBtn');

// Open
addSlotBtn.addEventListener('click', () => {
  slotModal.classList.add('open');
});

// Close
function closeSlotModalFn() {
  slotModal.classList.remove('open');
  document.getElementById('slotTimeInput').value = '';
  document.getElementById('slotSubjectInput').value = '';
}

closeSlotModal.addEventListener('click', closeSlotModalFn);
cancelSlotModal.addEventListener('click', closeSlotModalFn);

slotModal.addEventListener('click', (e) => {
  if (e.target === slotModal) closeSlotModalFn();
});

// Update subject dropdown in slot modal whenever subjects change
function updateSlotSubjectDropdown() {
  const select = document.getElementById('slotSubjectInput');
  select.innerHTML = '<option value="">Select a subject</option>';
  subjects.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = `${sub.name}|${sub.code}|${sub.color}|${sub.bg}`;
    opt.textContent = `${sub.name} (${sub.code})`;
    select.appendChild(opt);
  });
}

// Save slot
saveSlotBtn.addEventListener('click', () => {
  const day     = document.getElementById('slotDayInput').value;
  const time    = document.getElementById('slotTimeInput').value;
  const subVal  = document.getElementById('slotSubjectInput').value;

  if (!time || !subVal) {
    alert('Please fill in all fields.');
    return;
  }

  const [subName, subCode, slotColor, slotBg] = subVal.split('|');

  // Format time as HH:MM
  const formattedTime = time.substring(0, 5);

  // Find the day card and add slot
  addSlotToDay(day, formattedTime, subName, subCode, slotColor, slotBg);

  closeSlotModalFn();
});

/* Add a rendered slot to the correct day card */
function addSlotToDay(dayName, time, subName, subCode, color, bg) {
  // Find the day card by matching day-name text
  const dayCards = document.querySelectorAll('.day-card');
  let targetCard = null;

  dayCards.forEach(card => {
    const nameEl = card.querySelector('.day-name');
    if (nameEl && nameEl.textContent.trim() === dayName) {
      targetCard = card;
    }
  });

  if (!targetCard) return;

  const slotsContainer = targetCard.querySelector('.day-slots');

  // Remove empty slot message if present
  const emptySlot = slotsContainer.querySelector('.empty-slot');
  if (emptySlot) emptySlot.remove();

  // Create new slot element
  const slot = document.createElement('div');
  slot.className = 'slot';
  slot.style.setProperty('--slot-color', color);
  slot.style.setProperty('--slot-bg', bg);

  slot.innerHTML = `
    <span class="slot-time">${time}</span>
    <span class="slot-divider"></span>
    <span class="slot-subject">${subName}</span>
    <span class="slot-code">${subCode}</span>
  `;

  slotsContainer.appendChild(slot);

  // Update class count label
  const slotEls   = slotsContainer.querySelectorAll('.slot');
  const countEl   = targetCard.querySelector('.day-count');
  const count     = slotEls.length;
  countEl.textContent = count + (count === 1 ? ' class' : ' classes');
}

/* ──────────────────────────────────────
   DELETE BUTTONS on initial cards
────────────────────────────────────── */

document.querySelectorAll('#subjectsGrid .delete-btn').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.subject-card');
    card.style.transition = 'opacity 0.2s, transform 0.2s';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.96)';

    setTimeout(() => {
      const code = card.querySelector('.subject-code').textContent.trim();
      card.remove();
      subjects = subjects.filter(s => s.code !== code);
      updateSubjectCount();
      updateSlotSubjectDropdown();
    }, 200);
  });
});

/* ──────────────────────────────────────
   SAVE BUTTON — feedback
────────────────────────────────────── */

const btnSave = document.querySelector('.btn-save');

btnSave.addEventListener('click', () => {
  btnSave.innerHTML = '<i class="fa-solid fa-circle-check"></i> Saved!';
  btnSave.style.background = 'linear-gradient(135deg, #059669, #10B981)';

  setTimeout(() => {
    btnSave.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Semester Setup';
    btnSave.style.background = '';
  }, 2200);
});


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
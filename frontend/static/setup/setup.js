// setup.js — Setup page modal and profile dropdown
function switchTab(page, tabId, btn) {
  const panels = document.querySelectorAll('.tab-panel');
  const tabs = btn.closest('.page-tabs').querySelectorAll('.page-tab');
  panels.forEach(p => p.classList.remove('active'));
  tabs.forEach(t => t.classList.remove('active'));
  const target = document.getElementById(`${page}-${tabId}`);
  if (target) target.classList.add('active');
  btn.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function () {
  // Profile
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => { e.stopPropagation(); profileDropdown.classList.toggle('open'); });
    document.addEventListener('click', (e) => { if (!profileDropdown.contains(e.target) && e.target !== profileBtn) profileDropdown.classList.remove('open'); });
  }

  // Subject modal
  const addSubjectBtn = document.getElementById('addSubjectBtn');
  const subjectModal = document.getElementById('subjectModal');
  const closeSubjectModal = document.getElementById('closeSubjectModal');
  const cancelSubjectModal = document.getElementById('cancelSubjectModal');
  if (addSubjectBtn) addSubjectBtn.onclick = () => { subjectModal.classList.add('open'); };
  if (closeSubjectModal) closeSubjectModal.onclick = () => { subjectModal.classList.remove('open'); };
  if (cancelSubjectModal) cancelSubjectModal.onclick = () => { subjectModal.classList.remove('open'); };

  // Slot modal
  const addSlotBtn = document.getElementById('addSlotBtn');
  const slotModal = document.getElementById('slotModal');
  const closeSlotModal = document.getElementById('closeSlotModal');
  const cancelSlotModal = document.getElementById('cancelSlotModal');
  if (addSlotBtn) addSlotBtn.onclick = () => { slotModal.classList.add('open'); };
  if (closeSlotModal) closeSlotModal.onclick = () => { slotModal.classList.remove('open'); };
  if (cancelSlotModal) cancelSlotModal.onclick = () => { slotModal.classList.remove('open'); };

  // Close on overlay click
  [subjectModal, slotModal].forEach(modal => {
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
  });
});

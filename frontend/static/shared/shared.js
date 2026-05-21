/* shared.js — Common utilities for all StudySync pages */

// Tab switcher — used by attendance, assignments, notes, planner, calendar
function switchTab(page, tabId, btn) {
  const panels = document.querySelectorAll('.tab-panel');
  const tabs = btn.closest('.page-tabs').querySelectorAll('.page-tab');
  panels.forEach(p => p.classList.remove('active'));
  tabs.forEach(t => t.classList.remove('active'));
  const target = document.getElementById(`${page}-${tabId}`);
  if (target) target.classList.add('active');
  btn.classList.add('active');
}

// Profile dropdown
document.addEventListener('DOMContentLoaded', function () {
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!profileDropdown.contains(e.target) && e.target !== profileBtn) {
        profileDropdown.classList.remove('open');
      }
    });
  }

  // Auto-dismiss flash messages after 4 seconds
  const flashContainers = document.querySelectorAll('[data-flash-messages]');
  flashContainers.forEach(container => {
    setTimeout(() => {
      container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      container.style.opacity = '0';
      container.style.transform = 'translateY(-10px)';
      setTimeout(() => container.remove(), 500);
    }, 4000);
  });
});

// notes.js
function switchTab(page, tabId, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.closest('.page-tabs').querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
  const target = document.getElementById(`${page}-${tabId}`);
  if (target) target.classList.add('active');
  btn.classList.add('active');
}
document.addEventListener('DOMContentLoaded', function () {
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => { e.stopPropagation(); profileDropdown.classList.toggle('open'); });
    document.addEventListener('click', (e) => { if (!profileDropdown.contains(e.target) && e.target !== profileBtn) profileDropdown.classList.remove('open'); });
  }
});

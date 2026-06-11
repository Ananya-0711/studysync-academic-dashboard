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
      // Close notification dropdown if open
      const nd = document.getElementById('notifDropdown');
      if (nd) nd.classList.remove('open');
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

  // ── NOTIFICATION BELL DROPDOWN ──
  const bellBtn = document.getElementById('bellBtn');
  if (bellBtn) {
    // Inject notification dropdown CSS if not already present
    if (!document.querySelector('style[data-notif-dropdown]')) {
      const style = document.createElement('style');
      style.setAttribute('data-notif-dropdown', '1');
      style.textContent = `
        .notif-dropdown{position:absolute;top:56px;right:0;width:370px;max-height:460px;background:#fff;border-radius:18px;box-shadow:0 12px 40px rgba(0,0,0,.12),0 2px 8px rgba(124,58,237,.08);z-index:1001;display:none;overflow:hidden;border:1px solid #f3f4f6}
        .notif-dropdown.open{display:block;animation:notifSlideDown .22s ease}
        @keyframes notifSlideDown{from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        .notif-dropdown-header{display:flex;align-items:center;justify-content:space-between;padding:16px 20px 12px;border-bottom:1px solid #f3f4f6}
        .notif-dropdown-header h3{font-size:15px;font-weight:700;color:#1f2937;display:flex;align-items:center;gap:8px}
        .notif-dropdown-header .notif-badge{font-size:11px;font-weight:700;color:#fff;background:#ef4444;padding:2px 8px;border-radius:99px;min-width:20px;text-align:center}
        .notif-dropdown-body{overflow-y:auto;max-height:360px;padding:8px 0}
        .notif-dropdown-body::-webkit-scrollbar{width:5px}
        .notif-dropdown-body::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:99px}
        .notif-drop-item{display:flex;align-items:flex-start;gap:12px;padding:12px 20px;transition:background .12s;cursor:default}
        .notif-drop-item:hover{background:#faf9ff}
        .notif-drop-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px}
        .notif-drop-icon.danger{background:#fee2e2;color:#dc2626}
        .notif-drop-icon.warning{background:#fef3c7;color:#d97706}
        .notif-drop-icon.info{background:#ede9fe;color:#7c3aed}
        .notif-drop-text{flex:1;min-width:0}
        .notif-drop-text .ndt-title{font-size:13px;font-weight:600;color:#1f2937}
        .notif-drop-text .ndt-msg{font-size:12px;color:#6b7280;margin-top:2px;line-height:1.45}
        .notif-dropdown-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:36px 20px;color:#9ca3af;text-align:center}
        .notif-dropdown-empty .nde-icon{font-size:32px;margin-bottom:10px;opacity:.5}
        .notif-dropdown-empty .nde-text{font-size:13px;font-weight:500}
        .notif-dropdown-footer{padding:10px 20px;border-top:1px solid #f3f4f6;text-align:center}
        .notif-dropdown-footer a{font-size:13px;font-weight:600;color:#7c3aed;text-decoration:none;transition:opacity .15s}
        .notif-dropdown-footer a:hover{opacity:.7}
        body.dark-mode .notif-dropdown{background:#1e293b;border-color:#334155;box-shadow:0 12px 40px rgba(0,0,0,.35)}
        body.dark-mode .notif-dropdown-header{border-bottom-color:#334155}
        body.dark-mode .notif-dropdown-header h3{color:#f8fafc}
        body.dark-mode .notif-drop-item:hover{background:#273449}
        body.dark-mode .notif-drop-text .ndt-title{color:#f8fafc}
        body.dark-mode .notif-drop-text .ndt-msg{color:#94a3b8}
        body.dark-mode .notif-dropdown-empty{color:#64748b}
        body.dark-mode .notif-dropdown-footer{border-top-color:#334155}
        body.dark-mode .notif-dropdown-footer a{color:#c4b5fd}
        body.dark-mode .notif-dropdown-body::-webkit-scrollbar-thumb{background:#334155}
        body.dark-mode .notif-drop-icon.danger{background:#7f1d1d;color:#fecaca}
        body.dark-mode .notif-drop-icon.warning{background:#78350f;color:#fde68a}
        body.dark-mode .notif-drop-icon.info{background:#312e81;color:#c4b5fd}
      `;
      document.head.appendChild(style);
    }

    // Read notification data from the embedded script tag
    let notifItems = [];
    const dataEl = document.getElementById('notifData');
    if (dataEl) {
      try {
        notifItems = JSON.parse(dataEl.textContent);
      } catch (e) {
        notifItems = [];
      }
    }

    // Build dropdown HTML
    const dropdown = document.createElement('div');
    dropdown.className = 'notif-dropdown';
    dropdown.id = 'notifDropdown';

    let bodyHtml = '';
    if (notifItems.length > 0) {
      const iconMap = {
        danger:  '<i class="fa-solid fa-triangle-exclamation"></i>',
        warning: '<i class="fa-solid fa-clock"></i>',
        info:    '<i class="fa-solid fa-bell"></i>'
      };
      notifItems.forEach(item => {
        const iconClass = item.icon || 'info';
        bodyHtml += `
          <div class="notif-drop-item">
            <div class="notif-drop-icon ${iconClass}">
              ${iconMap[iconClass] || iconMap.info}
            </div>
            <div class="notif-drop-text">
              <div class="ndt-title">${item.title}</div>
              <div class="ndt-msg">${item.message}</div>
            </div>
          </div>`;
      });
    } else {
      bodyHtml = `
        <div class="notif-dropdown-empty">
          <div class="nde-icon">🔔</div>
          <div class="nde-text">No new notifications.<br>You're all caught up!</div>
        </div>`;
    }

    const badgeHtml = notifItems.length > 0
      ? `<span class="notif-badge">${notifItems.length}</span>`
      : '';

    dropdown.innerHTML = `
      <div class="notif-dropdown-header">
        <h3>Notifications ${badgeHtml}</h3>
      </div>
      <div class="notif-dropdown-body">
        ${bodyHtml}
      </div>
      <div class="notif-dropdown-footer">
        <a href="/dashboard/">View Dashboard →</a>
      </div>`;

    // Append dropdown to the notification-box (bell) so it positions relative to it
    bellBtn.style.position = 'relative';
    bellBtn.appendChild(dropdown);

    // Toggle on bell click
    bellBtn.addEventListener('click', (e) => {
      if (dropdown.contains(e.target)) {
        return;
      }
      e.stopPropagation();
      dropdown.classList.toggle('open');
      // Close profile dropdown if open
      if (profileDropdown) profileDropdown.classList.remove('open');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!bellBtn.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }
});

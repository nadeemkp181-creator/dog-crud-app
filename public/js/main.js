document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
    const sortLink = event.target.closest('.sort-link');
    if (!sortLink) {
      return;
    }

    event.preventDefault();

    const sortField = sortLink.dataset.sort;
    const currentDir = sortLink.dataset.dir === 'asc' ? 'asc' : 'desc';
    const nextDir = currentDir === 'asc' ? 'desc' : 'asc';
    const tbody = document.querySelector('table tbody');
    if (!tbody) {
      return;
    }

    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
      const aText = a.querySelector('td').textContent.trim().toLowerCase();
      const bText = b.querySelector('td').textContent.trim().toLowerCase();

      if (aText < bText) return nextDir === 'asc' ? -1 : 1;
      if (aText > bText) return nextDir === 'asc' ? 1 : -1;
      return 0;
    });

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));

    sortLink.dataset.dir = nextDir;
    const icon = sortLink.querySelector('.sort-icon');
    if (icon) {
      icon.textContent = nextDir === 'asc' ? '▲' : '▼';
    }
  });

  document.body.addEventListener('submit', async (event) => {
    const form = event.target;

    if (form.classList.contains('delete-form')) {
      event.preventDefault();

      const confirmed = window.confirm('Are you sure you want to delete this dog?');
      if (!confirmed) {
        return;
      }

      const action = form.getAttribute('action');
      const response = await fetch(action, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        window.alert('Delete failed. Please try again.');
        console.error('Delete failed:', response.status, errorText);
        return;
      }

      const result = await response.json();
      if (!result.success) {
        window.alert(result.message || 'Delete failed.');
        return;
      }

      const row = form.closest('tr');
      if (row) {
        row.remove();
        return;
      }

      window.location.href = '/dogs';
      return;
    }

    if (!form.classList.contains('ajax-form')) {
      return;
    }

    event.preventDefault();

    const action = form.getAttribute('action');
    const method = (form.getAttribute('method') || 'POST').toUpperCase();
    const formData = new URLSearchParams(new FormData(form));

    const response = await fetch(action, {
      method,
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      window.alert('Request failed. Please try again.');
      console.error('Form submit failed:', response.status, errorText);
      return;
    }

    const result = await response.json();
    if (!result.success) {
      window.alert(result.message || 'Request failed.');
      return;
    }

    if (result.redirect) {
      window.location.href = result.redirect;
      return;
    }

    window.location.reload();
  });
});

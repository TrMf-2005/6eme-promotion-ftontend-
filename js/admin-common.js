function getToken() { return localStorage.getItem('token'); }
function getAdmin() { return JSON.parse(localStorage.getItem('admin') || 'null'); }

function exigerConnexion() {
  if (!getToken() || !getAdmin()) {
    window.location.href = 'admin-connexion.html';
    return false;
  }
  return true;
}

function deconnexion() {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
  window.location.href = 'admin-connexion.html';
}

async function appelApi(chemin, options = {}) {
  const res = await fetch(`${API_URL}${chemin}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });
  if (res.status === 401) {
    deconnexion();
    throw new Error('Session expirée.');
  }
  const contentType = res.headers.get('content-type') || '';
  const resultat = contentType.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) throw new Error(resultat.message || 'Erreur.');
  return resultat;
}

function echapperHtml(texte) {
  const div = document.createElement('div');
  div.textContent = texte || '';
  return div.innerHTML;
}

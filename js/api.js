// Adapter l'URL une fois le backend déployé sur Render (comme les autres projets)
const API_BASE = "https://sixeme-promotion-backend-1.onrender.com/api";

const Auth = {
  getSiteToken: () => sessionStorage.getItem("siteToken"),
  setSiteToken: (t) => sessionStorage.setItem("siteToken", t),
  getAdminToken: () => sessionStorage.getItem("adminToken"),
  setAdminToken: (t) => sessionStorage.setItem("adminToken", t),
  getAdminInfo: () => JSON.parse(sessionStorage.getItem("adminInfo") || "null"),
  setAdminInfo: (info) => sessionStorage.setItem("adminInfo", JSON.stringify(info)),
  clearAdmin: () => { sessionStorage.removeItem("adminToken"); sessionStorage.removeItem("adminInfo"); },
};

async function apiCall(path, { method = "GET", body, token, isAdmin = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  const authToken = token || (isAdmin ? Auth.getAdminToken() : Auth.getSiteToken());
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Une erreur est survenue.");
  return data;
}

// Redirige vers l'accueil si le mot de passe du site n'a pas été saisi
function requireSiteAccess() {
  if (!Auth.getSiteToken()) window.location.href = "index.html";
}

// Redirige vers la connexion admin si aucune session admin valide
function requireAdminAccess() {
  if (!Auth.getAdminToken()) window.location.href = "login.html";
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

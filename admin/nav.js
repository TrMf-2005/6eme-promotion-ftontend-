function renderAdminNav(active) {
  const info = Auth.getAdminInfo();
  const isPrincipal = info?.role === "principal";

  const links = [
    { href: "dashboard.html", label: "Tableau de bord", key: "dashboard" },
    { href: "membres.html", label: "Membres", key: "membres" },
    { href: "reglages.html", label: "Réglages", key: "reglages" },
  ];
  if (isPrincipal) {
    links.push({ href: "historique.html", label: "Historique", key: "historique" });
    links.push({ href: "admins.html", label: "Administrateurs", key: "admins" });
  }

  const nav = document.createElement("nav");
  nav.className = "admin-nav";
  nav.innerHTML = links
    .map((l) => `<a href="${l.href}" class="${l.key === active ? "active" : ""}">${l.label}</a>`)
    .join("") + `<a href="#" onclick="logout()" style="margin-left:auto;">Déconnexion</a>`;

  document.body.prepend(nav);

  const header = document.createElement("div");
  header.style.cssText = "padding:14px 20px 0; font-size:12px; color:var(--text-muted);";
  header.textContent = `Connecté(e) en tant que ${info?.displayName || ""}`;
  document.body.insertBefore(header, nav.nextSibling);
}

function logout() {
  Auth.clearAdmin();
  window.location.href = "login.html";
}

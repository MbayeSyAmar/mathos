// ============================================
// AUTH GUARD - Protection des pages
// ============================================

// Vérifier l'authentification avant d'accéder à une page protégée
function requireAuth() {
  const user = JSON.parse(localStorage.getItem('mathosUser'));
  
  if (!user) {
    // Rediriger vers la page de connexion
    const currentPath = window.location.pathname;
    const loginPath = currentPath.includes('pages/') ? 'connexion.html' : 'pages/connexion.html';
    window.location.href = loginPath;
    return false;
  }
  
  return true;
}

// Vérifier si l'utilisateur est connecté
function isAuthenticated() {
  const user = JSON.parse(localStorage.getItem('mathosUser'));
  return user !== null;
}

// Obtenir l'utilisateur actuel
function getCurrentUser() {
  const userStr = localStorage.getItem('mathosUser');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Rediriger si déjà connecté (pour les pages de connexion/inscription)
function redirectIfAuthenticated() {
  if (isAuthenticated()) {
    window.location.href = 'dashboard.html';
  }
}

// Exporter les fonctions
window.requireAuth = requireAuth;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.redirectIfAuthenticated = redirectIfAuthenticated;


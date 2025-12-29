// ============================================
// ROLE GUARD - Gestion des rôles et redirections
// ============================================

/**
 * Vérifie le rôle de l'utilisateur et redirige vers le bon dashboard
 */
function checkUserRoleAndRedirect() {
    const user = window.AuthService ? window.AuthService.getCurrentUser() : JSON.parse(localStorage.getItem('mathosUser'));
    
    if (!user) {
        return null;
    }
    
    const role = user.role || 'student';
    const currentPath = window.location.pathname;
    
    // Déterminer le dashboard selon le rôle
    let dashboardPath = '';
    
    switch (role) {
        case 'super_admin':
        case 'admin':
            dashboardPath = '/pages/admin/super/dashboard.html';
            break;
        case 'professeur':
        case 'teacher':
            dashboardPath = '/pages/admin/professeur/dashboard.html';
            break;
        case 'tuteur':
        case 'tutor':
            dashboardPath = '/pages/admin/tuteur/dashboard.html';
            break;
        case 'redacteur':
        case 'editor':
            dashboardPath = '/pages/admin/redacteur/dashboard.html';
            break;
        case 'student':
        case 'etudiant':
        default:
            dashboardPath = '/pages/dashboard.html';
            break;
    }
    
    return { role, dashboardPath };
}

/**
 * Vérifie si l'utilisateur a le droit d'accéder à une page
 * @param {string} requiredRole - Rôle requis pour accéder à la page
 * @param {Array<string>} allowedRoles - Liste des rôles autorisés (optionnel)
 */
function requireRole(requiredRole, allowedRoles = null) {
    const user = window.AuthService ? window.AuthService.getCurrentUser() : JSON.parse(localStorage.getItem('mathosUser'));
    
    if (!user) {
        window.location.href = '/pages/connexion.html';
        return false;
    }
    
    const userRole = user.role || 'student';
    const roles = allowedRoles || [requiredRole];
    
    if (!roles.includes(userRole)) {
        alert(`Accès réservé aux ${requiredRole}s`);
        const { dashboardPath } = checkUserRoleAndRedirect();
        if (dashboardPath) {
            window.location.href = dashboardPath;
        } else {
            window.location.href = '/pages/dashboard.html';
        }
        return false;
    }
    
    return true;
}

/**
 * Redirige l'utilisateur vers son dashboard selon son rôle
 */
function redirectToDashboard() {
    const { dashboardPath } = checkUserRoleAndRedirect();
    if (dashboardPath) {
        window.location.href = dashboardPath;
    }
}

// Redirection automatique après connexion
document.addEventListener('DOMContentLoaded', () => {
    // Si on est sur la page de connexion et qu'on est déjà connecté, rediriger
    if (window.location.pathname.includes('connexion.html') || window.location.pathname.includes('inscription.html')) {
        const user = window.AuthService ? window.AuthService.getCurrentUser() : JSON.parse(localStorage.getItem('mathosUser'));
        if (user) {
            redirectToDashboard();
        }
    }
});

// Exporter les fonctions
window.checkUserRoleAndRedirect = checkUserRoleAndRedirect;
window.requireRole = requireRole;
window.redirectToDashboard = redirectToDashboard;


// ============================================
// MATHOSPHÈRE - JAVASCRIPT PRINCIPAL
// ============================================

// Gestion du header au scroll
window.addEventListener('scroll', function() {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// Fermer le menu mobile en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    const menu = document.getElementById('mobileMenu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (menu && toggle && !menu.contains(event.target) && !toggle.contains(event.target)) {
        menu.classList.remove('active');
    }
});

// Gestion du panier
let cart = JSON.parse(localStorage.getItem('mathosCart')) || [];

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        if (count > 0) {
            cartCount.textContent = count;
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Votre panier est vide</p>';
        cartTotal.textContent = '0 FCFA';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div style="display: flex; gap: 1rem; padding: 1rem; border-bottom: 1px solid var(--bg-muted);">
                <div style="width: 60px; height: 60px; background: var(--bg-muted); border-radius: var(--radius-md); flex-shrink: 0;"></div>
                <div style="flex: 1;">
                    <h4 style="margin-bottom: 0.25rem; font-size: 0.9375rem;">${item.name}</h4>
                    <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 0.5rem;">${item.price.toFixed(0)} FCFA × ${item.quantity}</p>
                    <div style="display: flex; gap: 0.5rem; align-items: center;">
                        <button onclick="updateCartQuantity(${index}, -1)" style="width: 24px; height: 24px; border: 1px solid var(--bg-muted); background: white; border-radius: 4px; cursor: pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateCartQuantity(${index}, 1)" style="width: 24px; height: 24px; border: 1px solid var(--bg-muted); background: white; border-radius: 4px; cursor: pointer;">+</button>
                        <button onclick="removeFromCart(${index})" style="margin-left: auto; color: var(--error); background: none; border: none; cursor: pointer; font-size: 0.875rem;">Supprimer</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `${total.toFixed(0)} FCFA`;
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    localStorage.setItem('mathosCart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
    
    // Notification
    showNotification(`${product.name} ajouté au panier`, 'success');
}

function updateCartQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('mathosCart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('mathosCart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--info)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1060;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animation slideOut
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialiser le compteur du panier au chargement
updateCartCount();

// Gestion des tabs
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-target');
            
            // Désactiver tous les tabs
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));
            
            // Activer le tab sélectionné
            tab.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Initialiser les tabs au chargement
document.addEventListener('DOMContentLoaded', initTabs);

// Recherche
function initSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.searchable-item');
            
            items.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initSearch);

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer pour les animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card, .section-title').forEach(el => {
        observer.observe(el);
    });
});

// Gestion de l'authentification avec Firebase
let currentUser = JSON.parse(localStorage.getItem('mathosUser')) || null;

async function login(email, password) {
  try {
    if (window.AuthService && window.AuthService.isAuthenticated !== undefined) {
      const user = await window.AuthService.login(email, password);
      currentUser = user;
      return user;
    } else {
      // Fallback simulation
      currentUser = {
        uid: 'demo_' + Date.now(),
        email: email,
        displayName: email.split('@')[0],
        role: 'student',
        emailVerified: true
      };
      localStorage.setItem('mathosUser', JSON.stringify(currentUser));
      return currentUser;
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
}

async function register(name, email, password) {
  try {
    if (window.AuthService && window.AuthService.register) {
      const user = await window.AuthService.register(name, email, password);
      currentUser = user;
      return user;
    } else {
      // Fallback simulation
      currentUser = {
        uid: 'user_' + Date.now(),
        email: email,
        displayName: name,
        role: 'student',
        emailVerified: true
      };
      localStorage.setItem('mathosUser', JSON.stringify(currentUser));
      return currentUser;
    }
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    throw error;
  }
}

async function logout() {
  try {
    if (window.AuthService) {
      await window.AuthService.logout();
    }
    currentUser = null;
    localStorage.removeItem('mathosUser');
    window.location.href = '../index.html';
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
  }
}

function isAuthenticated() {
  return currentUser !== null;
}

// Écouter les changements d'authentification
if (window.AuthService && window.AuthService.onAuthStateChanged) {
  window.AuthService.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
    } else {
      currentUser = null;
      localStorage.removeItem('mathosUser');
    }
  });
} else {
  // Mode simulation - charger l'utilisateur depuis localStorage
  const userStr = localStorage.getItem('mathosUser');
  if (userStr) {
    try {
      currentUser = JSON.parse(userStr);
    } catch (e) {
      currentUser = null;
      localStorage.removeItem('mathosUser');
    }
  }
}

// Exporter les fonctions pour utilisation globale
window.toggleMobileMenu = toggleMobileMenu;
window.toggleCart = toggleCart;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.login = login;
window.logout = logout;
window.isAuthenticated = isAuthenticated;


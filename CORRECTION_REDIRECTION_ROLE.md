# 🔧 Correction - Redirection par Rôle après Connexion

## 🎯 Problèmes identifiés

### 1. Teacher redirigé vers dashboard étudiant
**Symptôme** : Après connexion en tant que professeur, l'utilisateur était redirigé vers `/dashboard` (dashboard étudiant) au lieu de `/admin/professeur/dashboard`.

**Cause** : La page de connexion utilisait une redirection fixe vers `/dashboard` pour tous les utilisateurs.

### 2. Absence de navbar/footer sur mauvaises pages
**Symptôme** : Le professeur se retrouvait sur une page sans navbar et footer appropriés.

**Cause** : Le layout root conditionnait l'affichage selon le path, mais l'utilisateur était sur le mauvais path.

## ✅ Solutions implémentées

### 1. Fonction de redirection intelligente

Ajout d'une fonction `redirectByRole()` dans `app/connexion/page.tsx` :

```typescript
// Fonction pour rediriger selon le rôle
const redirectByRole = (role: string) => {
  if (from && !from.includes('/dashboard') && !from.includes('/admin')) {
    return from
  }
  
  switch (role) {
    case 'super_admin':
      return '/admin/super/dashboard'
    case 'teacher':
      return '/admin/professeur/dashboard'
    case 'tutor':
      return '/admin/tuteur/dashboard'
    case 'editor':
      return '/admin/redacteur/dashboard'
    case 'student':
    default:
      return '/dashboard'
  }
}
```

### 2. Redirection après login Firebase

Modification pour récupérer le rôle depuis Firestore :

```typescript
// Pour les autres identifiants, essayer Firebase Authentication
try {
  const firebaseUser = await login(email, password)
  
  // Récupérer le rôle depuis Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
  
  const userRole = userDoc.exists() ? userDoc.data()?.role || 'student' : 'student'
  
  // Créer un cookie de session
  document.cookie = `session=firebase_user_${Date.now()}; path=/; max-age=86400`
  
  // Rediriger selon le rôle
  router.push(redirectByRole(userRole))
} catch (firebaseError) {
  console.error("Firebase login error:", firebaseError)
  setError("Identifiants incorrects.")
  return
}
```

### 3. Comptes de test mis à jour

```typescript
// Étudiant
if (email === "demo@mathosphere.fr" && password === "mathosphere123") {
  // ...
  router.push(redirectByRole('student')) // → /dashboard
}

// Professeur
if (email === "prof@mathosphere.fr" && password === "prof123") {
  // ...
  router.push(redirectByRole('teacher')) // → /admin/professeur/dashboard
}
```

## 📋 Table de redirection

| Rôle | Destination après connexion |
|------|----------------------------|
| **student** | `/dashboard` |
| **teacher** | `/admin/professeur/dashboard` |
| **tutor** | `/admin/tuteur/dashboard` |
| **editor** | `/admin/redacteur/dashboard` |
| **super_admin** | `/admin/super/dashboard` |

## 🧪 Tests de validation

### Test 1 : Connexion Étudiant
```
Email: demo@mathosphere.fr
Password: mathosphere123
Résultat attendu: Redirigé vers /dashboard
Layout: Header + Footer
```

### Test 2 : Connexion Professeur
```
Email: prof@mathosphere.fr
Password: prof123
Résultat attendu: Redirigé vers /admin/professeur/dashboard
Layout: AdminHeader + AdminSidebar
```

### Test 3 : Connexion avec compte Firebase
```
Email: (votre compte Firebase avec role: teacher)
Password: (votre mot de passe)
Résultat attendu: 
  - Récupération du rôle depuis Firestore
  - Redirection vers /admin/professeur/dashboard si teacher
  - Layout correct selon le rôle
```

### Test 4 : Redirection depuis page protégée
```
1. Accéder à /admin/professeur/messages sans être connecté
2. Être redirigé vers /connexion?from=/admin/professeur/messages
3. Se connecter
4. Être redirigé vers /admin/professeur/messages (page d'origine)
```

## 🔄 Flux de connexion mis à jour

```
┌─────────────────┐
│  Page Connexion │
└────────┬────────┘
         │
         ├─ Comptes démo ?
         │  ├─ Oui → redirectByRole(role hardcodé)
         │  └─ Non → Continuer
         │
         ├─ Login Firebase
         │  └─ Succès ?
         │     ├─ Oui → getDoc(users/{uid})
         │     │        └─ Récupérer role
         │     │           └─ redirectByRole(role)
         │     └─ Non → Afficher erreur
         │
         └─ Redirection finale
            ├─ /dashboard (student)
            ├─ /admin/professeur/dashboard (teacher)
            ├─ /admin/tuteur/dashboard (tutor)
            ├─ /admin/redacteur/dashboard (editor)
            └─ /admin/super/dashboard (super_admin)
```

## 🎨 Layouts appliqués

### Pour `/dashboard` (Étudiant)
```tsx
// app/layout.tsx
if (isDashboardPage) {
  // Layout sans Header/Footer global
  <div className="flex flex-col min-h-screen">
    <main className="flex-1">{children}</main>
    <Toaster />
  </div>
}
```

### Pour `/admin/*` (Admin/Prof/Tuteur/Éditeur)
```tsx
// app/layout.tsx
if (isAdminPage) {
  // Layout sans Header/Footer global
  <>{children}<Toaster /></>
}

// app/admin/layout.tsx
<SidebarProvider>
  <div className="flex min-h-screen w-full">
    <AdminSidebar userRole={userRole} />
    <div className="flex flex-col flex-1 w-full">
      <AdminHeader userRole={userRole} />
      <main className="flex-1 p-6 overflow-auto bg-background">
        {children}
      </main>
    </div>
  </div>
</SidebarProvider>
```

### Pour pages publiques
```tsx
// app/layout.tsx (default)
<div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex-1">{children}</main>
  <Footer />
  <Cart />
  <MathChatbot />
  <Toaster />
</div>
```

## 🔐 Sécurité

### Vérifications implémentées

1. **Middleware** (`middleware.ts`)
   - Vérifie le cookie de session
   - Redirige vers login si non authentifié
   - Protège `/dashboard/*` et `/admin/*`

2. **AuthContext** (`lib/auth-context.tsx`)
   - Gère l'authentification Firebase
   - Charge les données utilisateur depuis Firestore
   - Expose `user` et `userData` (avec role)

3. **Layouts**
   - AdminLayout vérifie le rôle pour la sidebar
   - Affiche les éléments de navigation appropriés

## 📝 Comptes de test disponibles

### Étudiant
```
Email: demo@mathosphere.fr
Password: mathosphere123
Redirection: /dashboard
```

### Professeur
```
Email: prof@mathosphere.fr
Password: prof123
Redirection: /admin/professeur/dashboard
```

### Comptes Firebase
```
Utilisez vos propres comptes créés dans Firebase
Le rôle est lu depuis Firestore (collection users, champ role)
```

## 🐛 Résolution de problèmes

### Le prof est toujours redirigé vers /dashboard

**Solution** :
1. Vider le cache du navigateur
2. Supprimer tous les cookies
3. Se déconnecter complètement
4. Se reconnecter avec prof@mathosphere.fr

### Le layout n'est pas bon

**Vérifiez** :
1. L'URL actuelle (doit être `/admin/professeur/...`)
2. Ouvrez la console → Application → Cookies
3. Vérifiez que le cookie `session` existe
4. Redémarrez le serveur dev

### Erreur "Firebase login error"

**Pour comptes Firebase** :
1. Vérifiez que l'utilisateur existe dans Firebase Authentication
2. Vérifiez que le document existe dans Firestore (`users/{uid}`)
3. Vérifiez que le champ `role` existe et est correct

## ✅ Checklist de test

- [ ] Se connecter comme étudiant → redirigé vers `/dashboard`
- [ ] Dashboard étudiant a son propre layout (pas Header/Footer global)
- [ ] Se déconnecter
- [ ] Se connecter comme prof → redirigé vers `/admin/professeur/dashboard`
- [ ] Dashboard prof a AdminHeader + AdminSidebar
- [ ] Pas de Footer en bas de page admin
- [ ] Navigation sidebar fonctionne
- [ ] Cliquer sur "Messages" dans sidebar → `/admin/professeur/messages`
- [ ] Se déconnecter depuis l'admin
- [ ] Visiter page publique (/) → Header + Footer présents
- [ ] Connexion avec compte Firebase réel
- [ ] Redirection correcte selon le rôle Firestore

## 📊 Statut

✅ **Redirection par rôle** : Implémentée
✅ **Fonction redirectByRole** : Créée
✅ **Comptes de test** : Mis à jour
✅ **Récupération rôle Firebase** : Implémentée
✅ **Layouts conditionnels** : Fonctionnels
✅ **Import Firebase** : Corrigé
✅ **Erreurs TypeScript** : 0

## 🚀 Prochaines étapes

- [ ] Ajouter plus de comptes de test (tuteur, éditeur, super admin)
- [ ] Persister le rôle dans le cookie pour éviter requête Firestore
- [ ] Ajouter un loader pendant la récupération du rôle
- [ ] Gérer les erreurs de connexion plus élégamment
- [ ] Ajouter logs pour debug

---

**Résultat** : Les professeurs sont maintenant redirigés vers `/admin/professeur/dashboard` avec le bon layout (AdminHeader + AdminSidebar) et plus vers le dashboard étudiant ! ✅

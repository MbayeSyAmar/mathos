# 📨 Guide Navigation - Page Messages

## 🎯 Comment accéder à la page Messages

### Pour les PROFESSEURS

1. **Se connecter en tant que professeur**
   - Email d'un professeur existant
   - Ou créer un compte avec le rôle "teacher" dans Firebase

2. **Navigation automatique**
   - Après connexion, vous êtes redirigé vers `/admin/professeur/dashboard`
   - Dans la sidebar à gauche, cliquez sur **"Messages"**
   - Vous arrivez sur `/admin/professeur/messages`

3. **Ce que vous verrez**
   - Un chat avec le Super Admin
   - Zone de texte pour écrire des messages
   - Historique des conversations en temps réel
   - Conseils pour la communication

### Pour le SUPER ADMIN

1. **Se connecter en tant que super admin**
   - Email avec le rôle "super_admin" dans Firebase
   
2. **Navigation automatique**
   - Après connexion, vous êtes redirigé vers `/admin/super/dashboard`
   - Dans la sidebar à gauche, cliquez sur **"Messages"**
   - Vous arrivez sur `/admin/super/messages`

3. **Ce que vous verrez**
   - Liste de tous les professeurs qui ont envoyé des messages
   - Nombre de messages non lus par professeur
   - Possibilité de sélectionner un professeur pour discuter
   - Chat en temps réel avec le professeur sélectionné

## 🔗 URLs directes

### Professeur
```
http://localhost:3000/admin/professeur/messages
```

### Super Admin
```
http://localhost:3000/admin/super/messages
```

## 🎨 Sidebar Navigation

### Menu Professeur (mis à jour)
```
✅ Tableau de bord  → /admin/professeur/dashboard
✅ Demandes         → /admin/professeur/demandes
✅ Messages         → /admin/professeur/messages  ← NOUVEAU
✅ Cours            → /admin/professeur/cours
✅ Exercices        → /admin/professeur/exercices
✅ Quiz             → /admin/professeur/quiz
✅ Vidéos           → /admin/professeur/videos
✅ Paramètres       → /admin/professeur/parametres
```

### Menu Super Admin (mis à jour)
```
✅ Tableau de bord  → /admin/super/dashboard
✅ Utilisateurs     → /admin/super/utilisateurs
✅ Demandes         → /admin/super/demandes
✅ Messages         → /admin/super/messages  ← NOUVEAU
✅ Boutique         → /admin/super/boutique
✅ Contenu          → /admin/super/contenu
✅ Statistiques     → /admin/super/statistiques
✅ Paramètres       → /admin/super/parametres
```

## 🚀 Démarrage rapide

### 1. Lancer l'application

```powershell
cd "c:\Users\Amar\Downloads\mathosphere (3)"
pnpm dev
```

### 2. Ouvrir dans le navigateur

```
http://localhost:3000
```

### 3. Se connecter comme professeur

**Option A : Utiliser un professeur existant**
- Si vous avez déjà créé des professeurs dans Firebase (collection `users` avec `role: "teacher"`)
- Utilisez leur email et mot de passe

**Option B : Créer un nouveau professeur**

Aller dans Firebase Console → Authentication → Add user :
```
Email: prof1@example.com
Password: (votre mot de passe)
```

Puis dans Firestore → users → créer un document :
```json
{
  "email": "prof1@example.com",
  "displayName": "Jean Dupont",
  "role": "teacher",
  "photoURL": null,
  "speciality": "Mathématiques",
  "createdAt": (timestamp actuel)
}
```

### 4. Accéder à la page Messages

1. Connectez-vous avec le compte professeur
2. Vous êtes redirigé vers `/admin/professeur/dashboard`
3. Dans la **sidebar à gauche**, cliquez sur **"Messages"** (icône 💬)
4. Vous arrivez sur la page de chat avec le Super Admin !

## 💬 Utilisation de la messagerie

### Côté Professeur

**Premier message :**
1. Tapez votre message dans la zone de texte en bas
2. Cliquez sur "Envoyer" ou appuyez sur Entrée
3. Le message apparaît instantanément
4. Une conversation est automatiquement créée avec le Super Admin

**Messages suivants :**
- Les messages s'affichent en temps réel
- Vos messages à droite (couleur primaire)
- Messages du Super Admin à gauche (fond gris)
- Scroll automatique vers le bas
- Horodatage visible sur chaque message

**Conseils affichés :**
- Soyez clair et précis
- Incluez tous les détails pertinents
- Messages urgents = réponse prioritaire
- Respectez la confidentialité
- Temps de réponse : 24h en jours ouvrés

### Côté Super Admin

**Vue d'ensemble :**
1. Colonne de gauche : Liste de tous les professeurs
2. Badge rouge avec nombre de messages non lus
3. Cliquez sur un professeur pour ouvrir le chat
4. Colonne de droite : Chat en temps réel

**Gestion des conversations :**
- Sélectionnez un professeur dans la liste
- Le chat s'ouvre automatiquement
- Tapez et envoyez votre réponse
- Messages marqués comme "lus" automatiquement
- Mise à jour en temps réel

## 🔧 Fichiers modifiés

### Navigation mise à jour
```
components/admin/admin-sidebar.tsx
- Ajout "Messages" pour teacher
- Ajout "Demandes" et "Messages" pour super_admin
```

### Pages créées
```
app/admin/professeur/messages/page.tsx
- Page de chat pour professeurs
- Conversation avec Super Admin uniquement

app/admin/super/messages/page.tsx
- Page de gestion des messages pour Super Admin
- Liste de tous les professeurs avec conversations
- Interface de chat multi-conversations
```

## 🎯 Prochaines étapes

### Test manuel

1. **Créer un professeur de test**
   ```
   Email: test.prof@example.com
   Role: teacher
   DisplayName: Professeur Test
   ```

2. **Se connecter comme professeur**
   - Aller sur `/connexion`
   - Utiliser les identifiants du professeur
   - Cliquer sur "Messages" dans la sidebar

3. **Envoyer un premier message**
   - Taper : "Bonjour, j'ai une question concernant..."
   - Envoyer
   - Vérifier que le message apparaît

4. **Se connecter comme Super Admin**
   - Se déconnecter
   - Reconnecter avec le compte super_admin
   - Cliquer sur "Messages"
   - Voir le professeur dans la liste
   - Badge avec "1" message non lu
   - Cliquer sur le professeur
   - Voir le message
   - Répondre

5. **Retourner en professeur**
   - Se déconnecter
   - Reconnecter en professeur
   - Aller sur Messages
   - Voir la réponse du Super Admin en temps réel !

## 🐛 Dépannage

### "Page not found" sur /admin/professeur/messages

**Vérifiez :**
- Le fichier existe : `app/admin/professeur/messages/page.tsx`
- Redémarrez le serveur de dev : `Ctrl+C` puis `pnpm dev`
- Videz le cache : `Ctrl+Shift+R` dans le navigateur

### Pas de Super Admin trouvé

**Solution :**
1. Aller dans Firebase Console → Firestore
2. Collection `users`
3. Trouver ou créer un utilisateur avec `role: "super_admin"`
4. Assurez-vous qu'il a un `displayName`

### Chat ne charge pas

**Vérifiez :**
- Firestore Rules permettent la lecture/écriture de `conversations` et `messages`
- L'utilisateur est bien authentifié
- Console navigateur pour erreurs JavaScript

### Messages ne s'affichent pas en temps réel

**Solution :**
- Vérifiez la connexion Firebase
- Testez avec 2 navigateurs différents (professeur + admin)
- Vérifiez les règles Firestore

## 📚 Documentation liée

- `MESSAGING_SYSTEM.md` - Détails techniques complets
- `lib/services/messaging-service.ts` - Code du service
- `components/chat-interface.tsx` - Composant de chat réutilisable

## ✅ Checklist de déploiement

Avant de mettre en production :

- [ ] Tester avec plusieurs professeurs
- [ ] Tester les notifications en temps réel
- [ ] Vérifier les permissions Firestore
- [ ] Tester sur mobile
- [ ] Vérifier les performances avec >100 messages
- [ ] Implémenter la pagination des messages anciens
- [ ] Ajouter la recherche dans les conversations (admin)
- [ ] Ajouter les indicateurs "en train d'écrire..."
- [ ] Implémenter les notifications push
- [ ] Ajouter pièces jointes (images, PDF)

---

**Résumé : Pour accéder aux messages en tant que professeur, connectez-vous et cliquez sur "Messages" dans la sidebar ! 💬**

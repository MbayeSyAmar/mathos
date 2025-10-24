# 🔍 Configuration des Index Firestore

## ❌ Erreur rencontrée

```
FirebaseError: The query requires an index.
```

Cette erreur se produit lorsque Firestore nécessite un index composite pour effectuer des requêtes complexes sur la collection `pdfs`.

---

## ✅ Solution 1 : Créer l'index automatiquement (RECOMMANDÉ)

### Option A : Via le lien fourni dans l'erreur

1. **Cliquez sur le lien** fourni dans le message d'erreur Firebase
2. Vous serez redirigé vers la console Firebase
3. Cliquez sur **"Create Index"** ou **"Créer l'index"**
4. Attendez quelques minutes (généralement 2-5 minutes) que l'index soit créé
5. Actualisez votre application

### Option B : Via la console Firebase manuellement

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **mathosphere-fe4c0**
3. Dans le menu latéral, allez à **Firestore Database**
4. Cliquez sur l'onglet **"Indexes"** (Index)
5. Cliquez sur **"Create Index"** (Créer un index)
6. Configurez l'index comme suit :
   - **Collection ID**: `pdfs`
   - **Fields to index**:
     - `courseId` - Ascending
     - `type` - Ascending  
     - `uploadedAt` - Descending

---

## ✅ Solution 2 : Déployer via Firebase CLI

Si vous avez Firebase CLI installé :

```powershell
# Installer Firebase CLI (si pas déjà fait)
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser Firebase dans le projet (si pas déjà fait)
firebase init firestore

# Déployer les index
firebase deploy --only firestore:indexes
```

Le fichier `firestore.indexes.json` contient déjà la configuration nécessaire.

---

## 🔍 Pourquoi cet index est nécessaire ?

L'index est requis pour la requête dans `storage.service.ts` :

```typescript
const q = query(
  collection(db, "pdfs"),
  where("courseId", "==", courseId),
  where("type", "==", type),
  orderBy("uploadedAt", "desc"),
  limit(1)
)
```

Cette requête combine :
- ✅ **Filtrage** sur `courseId` et `type`
- ✅ **Tri** sur `uploadedAt`
- ✅ **Limite** à 1 résultat

Firebase nécessite un index composite pour ce type de requête.

---

## ⏱️ Temps de création

- **Automatic via link**: 2-5 minutes
- **Manual creation**: 2-5 minutes
- **Via CLI**: Immédiat (mais nécessite Firebase CLI configuré)

---

## 🎯 Status de l'index

Vous pouvez vérifier le statut de vos index dans :
- **Firebase Console** → **Firestore Database** → **Indexes**
- Status possibles :
  - 🟡 **Building** (En cours de création)
  - 🟢 **Enabled** (Actif et prêt)
  - 🔴 **Error** (Erreur lors de la création)

---

## 🔧 Alternative temporaire (développement seulement)

Si vous voulez tester rapidement sans attendre la création de l'index, vous pouvez modifier temporairement la requête dans `lib/services/storage.service.ts` :

```typescript
// TEMPORAIRE - Supprimer le orderBy pour éviter l'index
const q = query(
  collection(db, "pdfs"),
  where("courseId", "==", courseId),
  where("type", "==", type),
  limit(1)
)
```

**⚠️ ATTENTION** : Cette solution n'est pas recommandée car elle ne garantit pas de récupérer le PDF le plus récent.

---

## ✅ Recommandation

**Utilisez la Solution 1 - Option A** : Cliquez simplement sur le lien dans l'erreur et créez l'index automatiquement. C'est la méthode la plus simple et la plus rapide ! 🚀

Une fois l'index créé, l'erreur disparaîtra et votre système de PDF fonctionnera parfaitement.

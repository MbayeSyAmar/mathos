# 💬 Système de Messagerie Mathosphere

## Vue d'ensemble

Le système de messagerie permet la communication en temps réel entre les différents utilisateurs de la plateforme :
- **Étudiants ↔ Professeurs** : Communication dans le cadre de l'encadrement personnalisé
- **Professeurs ↔ Super Admin** : Communication pour questions administratives

## 🗄️ Structure Firestore

### Collection `conversations`

```typescript
{
  id: string                  // ID auto-généré
  studentId: string          // UID de l'étudiant
  studentName: string        // Nom de l'étudiant
  teacherId: string          // UID du professeur (ou super admin)
  teacherName: string        // Nom du professeur (ou super admin)
  encadrementId?: string     // ID de l'encadrement (si applicable)
  lastMessage?: string       // Aperçu du dernier message
  lastMessageAt?: Timestamp  // Date du dernier message
  unreadCountStudent: number // Messages non lus par l'étudiant
  unreadCountTeacher: number // Messages non lus par le professeur
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Collection `messages`

```typescript
{
  id: string                  // ID auto-généré
  conversationId: string     // Référence à la conversation
  senderId: string           // UID de l'expéditeur
  senderName: string         // Nom de l'expéditeur
  senderRole: "student" | "teacher" | "super_admin"
  content: string            // Contenu du message
  read: boolean              // Lu ou non
  readAt?: Timestamp         // Date de lecture
  createdAt: Timestamp
}
```

## 📁 Fichiers du système

### Services

#### `lib/services/messaging-service.ts`
Service principal de messagerie avec fonctions complètes :

**Gestion des conversations :**
- `createConversation()` - Créer une nouvelle conversation
- `getStudentConversations()` - Conversations d'un étudiant
- `getTeacherConversations()` - Conversations d'un professeur
- `getConversationByParticipants()` - Trouver conversation entre 2 personnes
- `getConversationsByUserId()` - Toutes les conversations d'un utilisateur (admin)

**Gestion des messages :**
- `sendMessage()` - Envoyer un message
- `getMessages()` - Récupérer les messages d'une conversation
- `markMessagesAsRead()` - Marquer messages comme lus

**Temps réel :**
- `subscribeToMessages()` - S'abonner aux nouveaux messages (onSnapshot)
- `subscribeToConversations()` - S'abonner aux conversations (onSnapshot)

**Utilitaires :**
- `getUnreadMessageCount()` - Nombre total de messages non lus

### Composants

#### `components/chat-interface.tsx`
Composant réutilisable d'interface de chat :

**Props :**
```typescript
{
  conversation: Conversation
  currentUserId: string
  currentUserName: string
  currentUserRole: "student" | "teacher" | "super_admin"
}
```

**Fonctionnalités :**
- ✅ Messages en temps réel (auto-refresh avec onSnapshot)
- ✅ Scroll automatique vers le bas
- ✅ Indicateur de messages lus/non lus
- ✅ Formatage des timestamps (HH:mm, Hier, dd MMM)
- ✅ Avatars avec initiales
- ✅ Bulles de messages colorées (primary pour user actuel, muted pour autre)
- ✅ Input avec bouton d'envoi
- ✅ États de chargement et d'envoi

### Pages

#### `app/dashboard/encadrement/page.tsx`
Page d'encadrement de l'étudiant avec chat intégré :

**Fonctionnalités :**
- Vue d'ensemble de l'encadrement
- Sessions à venir et passées
- Chat en temps réel avec le professeur
- Progression et statistiques
- Badges et récompenses
- Ressources partagées

#### `app/admin/professeur/messages/page.tsx`
Page de messagerie pour les professeurs :

**Fonctionnalités :**
- Chat unique avec le super admin
- Création automatique de la conversation si elle n'existe pas
- Recherche automatique du super admin
- Conseils pour la communication
- Interface épurée et professionnelle

#### `app/admin/super/messages/page.tsx`
Centre de messagerie du super admin :

**Fonctionnalités :**
- Vue de toutes les conversations avec les professeurs
- Liste des professeurs avec indicateurs de messages non lus
- Sélection de conversation
- Chat multi-conversations
- Informations sur chaque professeur (spécialité, email)
- Interface en deux colonnes (liste + chat)

## 🚀 Utilisation

### Pour les étudiants

1. Aller sur `/dashboard/encadrement`
2. Onglet "Messages"
3. Chat automatiquement initialisé avec le professeur assigné

```typescript
// Le chat s'initialise automatiquement dans useEffect
useEffect(() => {
  if (user && encadrement && teacher) {
    initializeConversation()
  }
}, [user, encadrement, teacher])
```

### Pour les professeurs

1. Aller sur `/admin/professeur/messages`
2. Chat automatiquement créé avec le super admin
3. Envoyer des messages pour questions/préoccupations

```typescript
// Recherche automatique du super admin
const q = query(usersRef, where("role", "==", "super_admin"))
const querySnapshot = await getDocs(q)
const adminDoc = querySnapshot.docs[0]
```

### Pour le super admin

1. Aller sur `/admin/super/messages`
2. Voir liste de tous les professeurs ayant envoyé des messages
3. Sélectionner un professeur pour voir la conversation
4. Répondre directement

```typescript
// Charger toutes les conversations
const convs = await getConversationsByUserId(user.uid)
```

## 🎨 Interface Utilisateur

### Chat Interface (ChatInterface component)

```
┌─────────────────────────────────────────┐
│ Messages                                │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────┐           │
│  │ Message de l'autre      │ 14:30     │
│  └─────────────────────────┘           │
│                                         │
│           ┌─────────────────────────┐  │
│   14:32   │ Mon message             │  │
│           └─────────────────────────┘  │
│                                         │
│  ┌─────────────────────────┐           │
│  │ Réponse                 │ 14:35     │
│  └─────────────────────────┘           │
│                                         │
├─────────────────────────────────────────┤
│ [Écrivez votre message...    ] [Envoi] │
└─────────────────────────────────────────┘
```

### Page Super Admin

```
┌──────────────┬────────────────────────────┐
│ Professeurs  │ Conversation avec...       │
├──────────────┼────────────────────────────┤
│              │                            │
│ ● Prof 1 (2) │  Chat Interface ici        │
│   Prof 2     │                            │
│   Prof 3     │                            │
│              │                            │
└──────────────┴────────────────────────────┘
```

## ⚡ Fonctionnalités temps réel

### Auto-refresh des messages

```typescript
useEffect(() => {
  if (!conversation) return

  const unsubscribe = subscribeToMessages(conversation.id, (newMessages) => {
    setMessages(newMessages)
    scrollToBottom()
  })

  return () => unsubscribe()
}, [conversation])
```

### Marquage automatique comme lu

```typescript
useEffect(() => {
  if (conversation && messages.length > 0) {
    markMessagesAsRead(conversation.id, currentUserId, currentUserRole)
  }
}, [messages, conversation, currentUserId, currentUserRole])
```

## 🔔 Notifications

### Badge de messages non lus (Dashboard)

```typescript
const unreadCount = await getUnreadMessageCount(user.uid, "student")
if (unreadCount > 0) {
  // Afficher badge avec nombre
}
```

### Toast lors de l'envoi

```typescript
await sendMessage(/* ... */)
toast.success("Message envoyé")
```

## 🛡️ Sécurité

### Vérifications côté client

```typescript
if (!user || !conversation) return
if (!content.trim()) return
```

### Validation des rôles

```typescript
senderRole: "student" | "teacher" | "super_admin"
```

### Protection des routes

Le middleware vérifie que l'utilisateur est authentifié et a le bon rôle avant d'accéder aux pages.

## 📊 Statistiques disponibles

- Nombre total de conversations
- Nombre de messages non lus
- Dernier message et timestamp
- Historique complet des conversations

## 🔄 Flux de création d'une conversation

### Étudiant → Professeur

1. Étudiant fait demande d'encadrement
2. Admin approuve et assigne professeur
3. Lors de la première visite de `/dashboard/encadrement`:
   ```typescript
   const conv = await getConversationByParticipants(studentId, teacherId)
   if (!conv) {
     await createConversation(studentId, studentName, teacherId, teacherName, encadrementId)
   }
   ```

### Professeur → Super Admin

1. Professeur accède à `/admin/professeur/messages`
2. Page cherche le super admin automatiquement
3. Crée conversation si elle n'existe pas
   ```typescript
   const adminDoc = querySnapshot.docs[0]
   await createConversation(teacherId, teacherName, adminId, adminName)
   ```

## 🎯 Points clés

✅ **Temps réel** : Utilise Firestore onSnapshot pour les mises à jour instantanées
✅ **Composant réutilisable** : ChatInterface peut être utilisé partout
✅ **Multi-rôles** : Support étudiant, professeur, super admin
✅ **Messages non lus** : Compteurs par utilisateur
✅ **Scroll automatique** : Toujours voir les derniers messages
✅ **Formatage dates** : Relatif et localisé en français
✅ **États de chargement** : Feedback visuel pendant les opérations
✅ **Gestion d'erreurs** : Toast notifications en cas de problème

## 🔧 Personnalisation

### Modifier les couleurs

```tsx
// Dans ChatInterface
className={cn(
  "rounded-lg p-3 max-w-[80%]",
  isCurrentUser
    ? "bg-primary text-primary-foreground ml-auto" // <-- Changer ici
    : "bg-muted"
)}
```

### Modifier la hauteur du chat

```tsx
<ScrollArea className="h-[600px]"> {/* <-- Changer ici */}
```

### Ajouter des pièces jointes

Étendre l'interface Message :
```typescript
export interface Message {
  // ...existing fields...
  attachments?: {
    url: string
    name: string
    type: string
  }[]
}
```

## 📝 Notes importantes

- Les conversations sont créées automatiquement lors de la première visite
- Le super admin peut voir toutes les conversations des professeurs
- Les étudiants ne peuvent discuter qu'avec leur professeur assigné
- Les professeurs peuvent contacter le super admin à tout moment
- Les messages sont marqués comme lus automatiquement quand affichés
- Le scroll vers le bas est automatique à chaque nouveau message

## 🚦 Statut

✅ **Service de messagerie** : Complet et fonctionnel
✅ **Composant ChatInterface** : Complet avec temps réel
✅ **Page étudiant** : Intégrée dans encadrement
✅ **Page professeur** : Créée et fonctionnelle
✅ **Page super admin** : Créée avec multi-conversations
✅ **Tests** : À faire

## 🔮 Améliorations futures

- [ ] Notifications push
- [ ] Pièces jointes (images, PDF)
- [ ] Émojis et réactions
- [ ] Messages vocaux
- [ ] Recherche dans l'historique
- [ ] Archivage de conversations
- [ ] Statut en ligne (online/offline)
- [ ] Indicateur "en train d'écrire..."
- [ ] Groupes de discussion
- [ ] Vidéo chat intégré

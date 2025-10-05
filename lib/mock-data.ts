// Données de test pour le développement
export const mockUsers = [
  {
    id: "user1",
    email: "demo@mathosphere.fr",
    password: "mathosphere123",
    name: "Utilisateur Démo",
    role: "student"
  },
  {
    id: "user2", 
    email: "etudiant@test.fr",
    password: "test123",
    name: "Étudiant Test",
    role: "student"
  },
  {
    id: "user3",
    email: "prof@mathosphere.fr", 
    password: "prof123",
    name: "Professeur Démo",
    role: "teacher"
  }
]

export const mockDiscussions = [
  {
    id: "1",
    titre: "Problème avec les dérivées partielles",
    contenu: "J'ai du mal à comprendre le concept des dérivées partielles. Quelqu'un pourrait-il m'expliquer avec un exemple simple ?",
    auteur: {
      id: "user2",
      nom: "Étudiant Test",
      avatar: "/placeholder-user.jpg"
    },
    dateCreation: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
    categorie: "Analyse",
    reponses: 5,
    vues: 42,
    derniereReponse: new Date(Date.now() - 3 * 60 * 60 * 1000), // Il y a 3 heures
    estPopulaire: true,
    estNouveau: false
  },
  {
    id: "2", 
    titre: "Méthode de résolution d'équations du second degré",
    contenu: "Quelles sont les différentes méthodes pour résoudre une équation du second degré ? Je connais la formule discriminant mais y en a-t-il d'autres ?",
    auteur: {
      id: "user1",
      nom: "Utilisateur Démo", 
      avatar: "/placeholder-user.jpg"
    },
    dateCreation: new Date(Date.now() - 5 * 60 * 60 * 1000), // Il y a 5 heures
    categorie: "Algèbre",
    reponses: 3,
    vues: 28,
    derniereReponse: new Date(Date.now() - 1 * 60 * 60 * 1000), // Il y a 1 heure
    estPopulaire: false,
    estNouveau: true
  },
  {
    id: "3",
    titre: "Géométrie dans l'espace - Calcul de volumes",
    contenu: "Comment calculer le volume d'un tétraèdre connaissant les coordonnées de ses sommets ?",
    auteur: {
      id: "user3",
      nom: "Professeur Démo",
      avatar: "/placeholder-user.jpg"
    },
    dateCreation: new Date(Date.now() - 12 * 60 * 60 * 1000), // Il y a 12 heures
    categorie: "Géométrie", 
    reponses: 7,
    vues: 65,
    derniereReponse: new Date(Date.now() - 30 * 60 * 1000), // Il y a 30 minutes
    estPopulaire: true,
    estNouveau: false
  }
]

export const mockProducts = [
  {
    id: "1",
    nom: "Algèbre Linéaire - Cours Complet",
    description: "Livre complet sur l'algèbre linéaire pour étudiants en licence",
    prix: 29.99,
    prixOriginal: 39.99,
    imageUrl: "/placeholder.jpg",
    categorie: "livres",
    note: 4.8,
    nombreNotes: 124,
    disponible: true,
    nouveau: true,
    stock: 10,
    dateCreation: new Date(),
    estPublie: true,
    tags: ["algèbre", "licence"],
    niveau: "licence"
  },
  {
    id: "2",
    nom: "Calculatrice Scientifique TI-82",
    description: "Calculatrice graphique pour lycée et études supérieures",
    prix: 89.99,
    prixOriginal: 99.99,
    imageUrl: "/placeholder.jpg", 
    categorie: "calculatrices",
    note: 4.6,
    nombreNotes: 89,
    disponible: true,
    nouveau: false,
    stock: 5,
    dateCreation: new Date(),
    estPublie: true,
    tags: ["calculatrice", "scientifique"],
    niveau: "lycée"
  },
  {
    id: "3",
    nom: "Kit de Géométrie Complet",
    description: "Compas, équerre, rapporteur et règle graduée",
    prix: 15.99,
    prixOriginal: 19.99,
    imageUrl: "/placeholder.jpg",
    categorie: "fournitures",
    note: 4.3,
    nombreNotes: 67,
    disponible: true,
    nouveau: false,
    stock: 15,
    dateCreation: new Date(),
    estPublie: true,
    tags: ["géométrie", "fournitures"],
    niveau: "collège"
  },
  {
    id: "4",
    nom: "Analyse Mathématique - Tome 1",
    description: "Cours d'analyse pour les deux premières années d'université",
    prix: 34.99,
    prixOriginal: 44.99,
    imageUrl: "/placeholder.jpg",
    categorie: "livres",
    note: 4.9,
    nombreNotes: 156,
    disponible: true,
    nouveau: true,
    stock: 8,
    dateCreation: new Date(),
    estPublie: true,
    tags: ["analyse", "université"],
    niveau: "licence"
  }
]

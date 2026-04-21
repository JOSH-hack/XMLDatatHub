 Manuel d'utilisation - XML DataHub Pro
 
Bienvenue dans le XML DataHub Pro, une plateforme interactive conçue pour centraliser, transformer et valider des flux de données complexes.

 
Section 1 : Guide pour les Non-Développeurs

L'objectif ici est de comprendre "quoi" faire et "pourquoi" c'est utile.

	1. Navigation Générale

Barre Latérale (Sidebar) : C'est votre centre de commande. Utilisez-la pour basculer entre les 6 modules du système.
L'Interface Néon : Chaque couleur a un sens. Le Cyan indique des flux actifs, le Violet indique des processus de transformation ou de sécurité.
Bouton "AIDE" (Header) : Si vous êtes perdu, cliquez sur ce bouton pour ouvrir un guide interactif qui explique le fonctionnement de la page actuelle.

	2. Le Dashboard (Tableau de Bord)

C'est la vue d'ensemble. Vous y voyez la santé du système (Nœuds actifs) et le volume de données traitées. Si les voyants sont au vert, le hub fonctionne parfaitement.

	3. Catalogue & Inventaire (Validation)
	
Usage : Permet de voir une liste de produits stockés de manière sécurisée.
Action : Cliquez sur le bouton "ANALYSER XSD". Le système va vérifier si les données respectent les règles de l'entreprise (ex: un prix ne peut pas être négatif).
Export : Utilisez le bouton "EXPORTER" pour enregistrer les données sur votre ordinateur.

	4. Générateur de CV (Rendu Visuel)

Usage : Pour transformer des données brutes en un document élégant.
Action : Cliquez sur "DÉCLENCHER XSLT". Vous verrez des lignes de code se transformer instantanément en un CV professionnel. C'est la magie de la "transformation documentaire".

	5. Convertisseur (Outil de Traduction)
	
Usage : Si vous avez des données d'un vieux logiciel (XML) et que vous en avez besoin pour un logiciel récent (JSON), ou inversement.
Action : Copiez votre texte dans la zone de gauche, cliquez sur le bouton de conversion, et récupérez le résultat à droite.


Section 2 : Guide pour les Développeurs

L'objectif ici est de comprendre l'architecture et comment étendre le projet.

	1. Installation & Lancement
	
code
Bash
# 1. Installation des dépendances
npm install

# 2. Lancement du serveur de développement (Backend + Frontend)
npm run dev
Note : Le projet utilise tsx pour exécuter le serveur Node et vite pour le frontend.

	2. Architecture des Flux XML
	
Le projet démontre les 4 piliers du XML :
Validation (XSD) : Les schémas sont gérés côté backend. Le bouton "Vérifier" simule l'appel à un validateur de schéma pour garantir l'intégrité des données avant traitement.
Transformation (XSLT) : Utilise l'API native XSLTProcessor du navigateur.
Fichiers sources récupérés via /api/xslt/:name.
Données récupérées via /api/xml/:id.
Parsing & Mapping : Le backend utilise fast-xml-parser (recommandé pour sa vitesse) pour transformer les POST JSON en documents XML structurés.
SOAP Service : Le point de terminaison /api/soap/service accepte uniquement du Content-Type: application/xml. Il extrait l'ID utilisateur de l'enveloppe SOAP et renvoie une réponse XML encapsulée.

	3. Points d'Entrée API (Endpoints)
	
GET /api/xml/products : Retourne le catalogue au format XML.
GET /api/xml/cv : Retourne les data du CV au format XML.
POST /api/convert/json-to-xml : Prend du JSON brut et renvoie un flux XML.
POST /api/soap/service : Reçoit une enveloppe SOAP et traite la requête.

	4. Personnalisation du Design
	
Le design "Pro Polish" est centralisé dans src/index.css.
Variables CSS : Modifiez --neon-cyan ou --neon-purple pour changer l'ambiance globale.
Effets Glass : Utilisez la classe .glass sur n'importe quel conteneur pour appliquer le flou d'arrière-plan et la bordure subtile.
Animations : Les classes .float et .pulse sont disponibles pour animer des éléments importants.

	5. Déploiement sur Vercel
	
Le fichier vercel.json est configuré comme suit :
code
JSON
{
  "rewrites": [{ "source": "/api/(.*)", "destination": "/api" }]
}
Cela permet à Vercel de rediriger tous les appels API vers la fonction serverless générée à partir de server.ts.

🛡 Sécurité & Performances
Zéro Dépendance Lourde : Le système utilise les API natives du navigateur pour les transformations XML pour une performance maximale.
Responsivité : L'interface est construite avec un système de grille (Grid) Tailwind, garantissant un affichage propre sur écrans larges (Dashboarding) et plus petits.

XML DataHub Pro : Documentation Technique

Ce projet est un "DataHub" full-stack conçu pour démontrer l'orchestration de données via le standard XML dans un environnement moderne.

-- Architecture Globale

Frontend : React 18 / Vite / Tailwind CSS / Framer Motion.
Backend : Node.js avec Express (configuré pour Vercel Serverless).
Format Pivot : XML (Utilisé pour le stockage, l'échange, la config et le rendu).

-- Fonctionnalités & Rôle du XML

	1. Dashboard (Monitoring de Flux)
Ce que fait le XML : Le tableau de bord simule la surveillance de nœuds distribués qui communiquent exclusivement en XML.

Localisation Code :
UI : src/App.tsx (Composant Dashboard).
Données : Les statistiques sont calculées (simulées) pour refléter l'intégrité des fichiers XML présents sur le serveur.

	2. Catalogue Produits (Stockage & Validation XSD)
	
Ce que fait le XML : Sert de base de données plate pour des structures hiérarchiques complexes (Produit > Catégorie > Prix).
Rôle Technique : Utilisation de XSD (XML Schema Definition) pour forcer le typage (ex: le price doit être un decimal).

Localisation Code :
Client : src/App.tsx (Composant Catalog).
Serveur : server.ts route GET /api/xml/products.
Fichier Source : Les données sont servies dynamiquement par le backend.

	3. Générateur de CV (Transformation XSLT)
	
Ce que fait le XML : Sépare totalement la donnée (cv.xml) de la présentation.
Rôle Technique : Le moteur XSLT (XSLTProcessor dans le navigateur) prend le XML brut et lui applique une feuille de style (cv.xslt) pour générer du HTML dynamique sans que le serveur n'ait à calculer le rendu.

Localisation Code :
Client : src/App.tsx (Composant CVGenerator et fonction transformXml).
Serveur : server.ts routes GET /api/xml/cv et GET /api/xslt/:name.

	4. Converter (Interopérabilité XML ↔ JSON Mapping)
	
Ce que fait le XML : Démontre la capacité de migration de données.
Rôle Technique : Utilisation de bibliothèques de parsing (fast-xml-parser ou xml2js) côté backend pour transformer des objets JSON en arbres XML valides et inversement.

Localisation Code :
Client : src/App.tsx (Composant Converter).
Serveur : server.ts routes POST /api/convert/json-to-xml et POST /api/convert/xml-to-json.

	5. SOAP Tester (Messagerie d'Entreprise)
	
Ce que fait le XML : Simule un Web Service "Legacy" (bancaire, industriel) où la communication se fait par enveloppes.
Rôle Technique : Construction d'une Enveloppe SOAP (Header + Body). Le serveur reçoit le XML, le parse, et répond avec une enveloppe SOAP de confirmation.

Localisation Code :
Client : src/App.tsx (Composant SoapTester).
Serveur : server.ts route POST /api/soap/service.

	6. Config & Properties (XML en tant que Config)
	
Ce que fait le XML : Gère les paramètres système (thème, langue, version de l'API).
Rôle Technique : À l'instar des fichiers .web.config ou .pom.xml, le XML centralise les paramètres métier.
Localisation Code :
Client : src/App.tsx (Composant ConfigView).
Serveur : server.ts route GET /api/config.

-- Organisation des Fichiers

Fichier / Dossier	Description

server.ts	Cœur de l'application. Gère toutes les API, le parsing XML et la logique de transformation.

src/App.tsx	Interface Utilisateur. Contient toute la logique React, les animations et la gestion des outils
(Mode d'emploi, Export).

src/index.css	Identité Visuelle. Contient les variables néon, les effets de glassmorphism et les animations
@keyframes.

vercel.json	Déploiement. Indique à Vercel comment transformer le serveur Express en "Serverless Functions".

package.json	Définit les dépendances critiques (fast-xml-parser, express, framer-motion).


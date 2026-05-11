import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper
const json = (arr: string[]) => JSON.stringify(arr)

async function main() {
  console.log('🌱 Initialisation de la base de données DCG UE 8 SIG...')

  // ── NETTOYAGE ────────────────────────────────────────────────────────────
  await prisma.studentAnswer.deleteMany()
  await prisma.redaction.deleteMany()
  await prisma.score.deleteMany()
  await prisma.mCQ.deleteMany()
  await prisma.redactionQuestion.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.student.deleteMany()
  console.log('🗑️  Base nettoyée')

  // ── ÉTUDIANTS (34 — source : Pédagogie SIG - BDD) ───────────────────────
  const studentData = [
    { studentCode: 'ID0001', password: 'XX11' },
    { studentCode: 'ID0002', password: 'XX14' },
    { studentCode: 'ID0003', password: 'XX17' },
    { studentCode: 'ID0004', password: 'XX20' },
    { studentCode: 'ID0005', password: 'XX23' },
    { studentCode: 'ID0006', password: 'XX26' },
    { studentCode: 'ID0007', password: 'XX29' },
    { studentCode: 'ID0008', password: 'XX32' },
    { studentCode: 'ID0009', password: 'XX35' },
    { studentCode: 'ID0010', password: 'XX38' },
    { studentCode: 'ID0011', password: 'XX41' },
    { studentCode: 'ID0012', password: 'XX44' },
    { studentCode: 'ID0013', password: 'XX47' },
    { studentCode: 'ID0014', password: 'XX50' },
    { studentCode: 'ID0015', password: 'XX53' },
    { studentCode: 'ID0016', password: 'XX56' },
    { studentCode: 'ID0017', password: 'XX59' },
    { studentCode: 'ID0018', password: 'XX62' },
    { studentCode: 'ID0019', password: 'XX65' },
    { studentCode: 'ID0020', password: 'XX68' },
    { studentCode: 'ID0021', password: 'XX71' },
    { studentCode: 'ID0022', password: 'XX74' },
    { studentCode: 'ID0023', password: 'XX77' },
    { studentCode: 'ID0024', password: 'XX80' },
    { studentCode: 'ID0025', password: 'XX83' },
    { studentCode: 'ID0026', password: 'XX86' },
    { studentCode: 'ID0027', password: 'XX89' },
    { studentCode: 'ID0028', password: 'XX92' },
    { studentCode: 'ID0029', password: 'XX95' },
    { studentCode: 'ID0030', password: 'XX98' },
    { studentCode: 'ID0031', password: 'XX101' },
    { studentCode: 'ID0032', password: 'XX104' },
    { studentCode: 'ID0033', password: 'XX107' },
    { studentCode: 'ID0034', password: 'XX110' },
    { studentCode: 'DEMO',   password: 'DEMO' },
  ]
  await prisma.student.createMany({ data: studentData })
  console.log(`✅ ${studentData.length} étudiants créés`)

  // ── CHAPITRES ────────────────────────────────────────────────────────────
  const chapitres = await prisma.chapter.createManyAndReturn({
    data: [
      { number: 1,  title: "Le système d'information et l'organisation",       description: "Concepts fondamentaux, rôle et enjeux du SI" },
      { number: 2,  title: "Étude et conception du système d'information",      description: "Merise, MCD, MLD, diagrammes de flux" },
      { number: 3,  title: "Le cadre légal et réglementaire",                  description: "RGPD, CNIL, propriété intellectuelle, contrats" },
      { number: 4,  title: "La gestion de projet informatique",                 description: "Méthodes, planification, MOA/MOE, risques" },
      { number: 5,  title: "Les réseaux et les infrastructures",                description: "OSI, TCP/IP, cloud, virtualisation" },
      { number: 6,  title: "Les bases de données",                              description: "Modèle relationnel, SQL, SGBD, intégrité" },
      { number: 7,  title: "Les progiciels de gestion intégrée (PGI/ERP)",     description: "ERP, intégration des processus, implémentation" },
      { number: 8,  title: "Le système d'information décisionnel",              description: "Data Warehouse, OLAP, BI, tableaux de bord" },
      { number: 9,  title: "La sécurité des systèmes d'information",           description: "Menaces, politiques, PCA/PRA, cryptographie" },
      { number: 10, title: "Les échanges électroniques",                        description: "EDI, signature électronique, e-commerce, dématérialisation" },
    ],
  })

  // Map numéro → id
  const ch = Object.fromEntries(chapitres.map((c) => [c.number, c.id]))
  console.log(`✅ 10 chapitres créés`)

  // ── QCM ──────────────────────────────────────────────────────────────────
  const mcqData = [
    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 1 — Le SI et l'organisation
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[1], notion: "Définition et composantes du SI",
      question: "Qu'est-ce qu'un système d'information (SI) ?",
      options: json(["Un réseau informatique d'entreprise", "Un ensemble organisé de ressources permettant de collecter, stocker, traiter et diffuser de l'information", "Un logiciel de gestion de base de données", "Un ensemble d'ordinateurs reliés en réseau"]),
      correctAnswer: 1,
      explanation: "Le SI est un ensemble organisé de ressources (humaines, matérielles, logicielles, procédures) permettant de collecter, stocker, traiter et diffuser l'information au sein de l'organisation.",
    },
    {
      chapterId: ch[1], notion: "Fonctions du SI",
      question: "Parmi les propositions suivantes, laquelle n'est PAS une fonction du SI ?",
      options: json(["Saisir et collecter des données", "Mémoriser et stocker l'information", "Fabriquer des produits physiques", "Diffuser et communiquer l'information"]),
      correctAnswer: 2,
      explanation: "Les 4 fonctions fondamentales du SI sont : collecter, mémoriser, traiter et diffuser l'information. La fabrication relève du système opérant.",
    },
    {
      chapterId: ch[1], notion: "Types de SI",
      question: "Quel type de SI est spécifiquement conçu pour aider les dirigeants dans leurs décisions stratégiques ?",
      options: json(["SI opérationnel (ERP)", "SI de pilotage (Tableau de bord)", "Système d'Information de Direction (SID/EIS)", "Système de Gestion de Base de Données (SGBD)"]),
      correctAnswer: 2,
      explanation: "Le SID (Executive Information System) fournit aux dirigeants des informations synthétiques sur les indicateurs clés pour la prise de décision stratégique.",
    },
    {
      chapterId: ch[1], notion: "SI et processus métier",
      question: "Un processus métier est :",
      options: json(["Un logiciel de gestion des processus", "Un ensemble d'activités organisées produisant un résultat ayant de la valeur pour un client", "Une procédure informatisée de traitement des données", "Un diagramme de flux d'information"]),
      correctAnswer: 1,
      explanation: "Un processus métier (business process) est un enchaînement d'activités qui, exécutées dans un certain ordre, produisent un résultat attendu par un client interne ou externe.",
    },
    {
      chapterId: ch[1], notion: "Urbanisation du SI",
      question: "L'urbanisation du SI consiste à :",
      options: json(["Installer des équipements informatiques dans les villes", "Organiser et structurer le SI en zones cohérentes pour le rendre plus agile et évolutif", "Mettre à jour les logiciels de l'entreprise", "Créer un réseau local d'entreprise"]),
      correctAnswer: 1,
      explanation: "L'urbanisation du SI est une démarche d'organisation du SI en zones (stratégiques, fonctionnelles, applicatives) pour faciliter son évolution et sa maintenabilité.",
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 2 — Étude et conception du SI
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[2], notion: "MCD et entités",
      question: "Dans la méthode Merise, le Modèle Conceptuel de Données (MCD) représente :",
      options: json(["La structure physique de la base de données", "Les tables et leurs clés dans le SGBD", "Les entités, leurs attributs et les associations entre entités", "Les écrans et formulaires de l'application"]),
      correctAnswer: 2,
      explanation: "Le MCD représente les données sous forme d'entités (objets), d'attributs (propriétés) et d'associations (relations entre entités), de façon indépendante de toute implémentation technique.",
    },
    {
      chapterId: ch[2], notion: "MCD et entités",
      question: "Dans un MCD, une cardinalité (0,N) signifie :",
      options: json(["L'entité participe exactement à N associations", "L'entité peut participer à zéro ou plusieurs occurrences de l'association", "L'entité ne participe jamais à l'association", "L'entité participe obligatoirement à N associations"]),
      correctAnswer: 1,
      explanation: "La cardinalité (0,N) : '0' = participation facultative (minimum 0), 'N' = pas de maximum (peut participer à plusieurs occurrences).",
    },
    {
      chapterId: ch[2], notion: "MLD et passage MCD→MLD",
      question: "Lors du passage du MCD au MLD relationnel, une association (0,N)-(0,N) :",
      options: json(["Disparaît complètement", "Génère une clé étrangère dans l'une des deux tables", "Génère une table intermédiaire avec les clés primaires des deux entités liées", "Devient un attribut calculé"]),
      correctAnswer: 2,
      explanation: "Règle de passage MCD→MLD : une association de type (N,N) génère une table intermédiaire (table de jointure) contenant les clés primaires des deux entités comme clés étrangères.",
    },
    {
      chapterId: ch[2], notion: "Diagrammes de flux",
      question: "Un diagramme de flux de données (DFD) permet de représenter :",
      options: json(["La structure hiérarchique de l'entreprise", "Les flux d'informations entre acteurs, processus et entités externes", "La chronologie des événements dans un projet", "L'architecture matérielle du réseau"]),
      correctAnswer: 1,
      explanation: "Le diagramme de flux représente les échanges d'informations entre les différents acteurs (internes et externes) et les traitements. Il est utilisé dans la méthode Merise.",
    },
    {
      chapterId: ch[2], notion: "Dictionnaire de données",
      question: "Dans un dictionnaire de données, que recense-t-on pour chaque donnée ?",
      options: json(["Uniquement le nom de la donnée", "Le nom, le type, la taille, la règle de gestion et la description", "Le code SQL de création de la table", "L'adresse mémoire de stockage de la donnée"]),
      correctAnswer: 1,
      explanation: "Le dictionnaire de données recense toutes les données du SI avec : nom, mnémonique, type (texte, numérique, date), taille, format, règle de gestion et liste des valeurs possibles.",
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 3 — Cadre légal et réglementaire
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[3], notion: "RGPD et protection des données",
      question: "Le RGPD s'applique :",
      options: json(["Uniquement aux entreprises de plus de 250 salariés", "À toute organisation traitant des données personnelles de résidents européens, quelle que soit sa taille", "Uniquement aux entreprises du secteur informatique", "Seulement aux données médicales"]),
      correctAnswer: 1,
      explanation: "Le RGPD (entré en vigueur le 25 mai 2018) s'applique à toute organisation (quelle que soit sa taille) qui traite des données à caractère personnel de personnes résidant dans l'UE.",
    },
    {
      chapterId: ch[3], notion: "RGPD et protection des données",
      question: "Selon le RGPD, une donnée à caractère personnel est :",
      options: json(["Toute donnée relative à une entreprise", "Toute information permettant d'identifier, directement ou indirectement, une personne physique", "Uniquement le nom et le prénom d'une personne", "Les données financières d'une organisation"]),
      correctAnswer: 1,
      explanation: "Une donnée personnelle est 'toute information se rapportant à une personne physique identifiée ou identifiable'. Cela inclut : nom, adresse IP, géolocalisation, identifiants en ligne.",
    },
    {
      chapterId: ch[3], notion: "CNIL et responsabilités",
      question: "Quel organisme est chargé de contrôler l'application du RGPD en France ?",
      options: json(["La DGCCRF", "La CNIL (Commission Nationale de l'Informatique et des Libertés)", "Le Conseil d'État", "La Banque de France"]),
      correctAnswer: 1,
      explanation: "La CNIL est l'autorité de contrôle française. Elle peut effectuer des contrôles, émettre des mises en demeure et prononcer des sanctions (jusqu'à 20 M€ ou 4% du CA mondial).",
    },
    {
      chapterId: ch[3], notion: "Propriété intellectuelle et licences",
      question: "Un logiciel sous licence propriétaire :",
      options: json(["Peut être librement modifié et redistribué", "Est gratuit mais son code source est protégé", "Appartient à son éditeur qui en contrôle la distribution et l'utilisation", "Est nécessairement payant et open-source"]),
      correctAnswer: 2,
      explanation: "Un logiciel propriétaire appartient à son éditeur qui en contrôle strictement la distribution, la modification et l'utilisation. Le code source n'est généralement pas accessible.",
    },
    {
      chapterId: ch[3], notion: "Contrats informatiques",
      question: "Le contrat de maintenance informatique a pour objet :",
      options: json(["La vente de matériel informatique", "La formation des utilisateurs", "Garantir le bon fonctionnement du système informatique après sa mise en production", "La conception et le développement d'un nouveau logiciel"]),
      correctAnswer: 2,
      explanation: "Le contrat de maintenance garantit le bon fonctionnement du SI après mise en production. Il peut inclure : maintenance corrective (bugs), évolutive (nouvelles fonctionnalités) et préventive.",
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 4 — Gestion de projet informatique
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[4], notion: "Méthodes agiles et classiques",
      question: "La méthode Agile se caractérise par :",
      options: json(["Une planification exhaustive dès le début du projet sans modification possible", "Des cycles de développement courts et itératifs avec des livraisons régulières de valeur", "L'absence totale de documentation", "Un chef de projet unique prenant toutes les décisions"]),
      correctAnswer: 1,
      explanation: "Les méthodes Agiles (Scrum, Kanban…) favorisent des sprints courts (2-4 semaines), des livraisons régulières, l'adaptation au changement et la collaboration étroite avec le client.",
    },
    {
      chapterId: ch[4], notion: "Planification (Gantt, PERT)",
      question: "Dans un diagramme de Gantt, les barres horizontales représentent :",
      options: json(["Les ressources humaines affectées au projet", "La durée des tâches positionnées dans le temps", "Le coût de chaque tâche", "Les risques identifiés"]),
      correctAnswer: 1,
      explanation: "Le diagramme de Gantt représente graphiquement les tâches sous forme de barres dont la longueur est proportionnelle à leur durée, positionnées sur un axe temporel.",
    },
    {
      chapterId: ch[4], notion: "MOA / MOE / AMOA",
      question: "La MOA (Maîtrise d'Ouvrage) dans un projet informatique est :",
      options: json(["L'équipe de développeurs qui code l'application", "Le client ou donneur d'ordre qui exprime les besoins et réceptionne le produit", "Le prestataire informatique qui réalise le projet", "L'équipe de maintenance du système"]),
      correctAnswer: 1,
      explanation: "La MOA est l'entité pour laquelle le projet est réalisé. Elle exprime les besoins, valide les livrables et réceptionne le produit final. Elle s'oppose à la MOE (Maîtrise d'Œuvre) qui réalise.",
    },
    {
      chapterId: ch[4], notion: "Étapes d'un projet informatique",
      question: "Le cahier des charges fonctionnel (CdCF) est rédigé par :",
      options: json(["La MOE pour décrire comment elle va réaliser le projet", "La MOA pour exprimer ses besoins en termes de fonctionnalités attendues", "L'équipe de test pour valider le système", "Le directeur informatique pour définir l'architecture technique"]),
      correctAnswer: 1,
      explanation: "Le CdCF décrit 'quoi faire' en termes fonctionnels, sans imposer 'comment'. Il est rédigé par la MOA (ou l'AMOA) et sert de référence pour l'appel d'offres.",
    },
    {
      chapterId: ch[4], notion: "Gestion des risques",
      question: "La méthode de la valeur acquise (EVM) est utilisée pour :",
      options: json(["Valoriser les actifs immatériels de l'entreprise", "Mesurer l'avancement réel d'un projet et détecter les dérives de coûts et de délais", "Calculer la valeur nette d'une acquisition d'entreprise", "Estimer le coût total d'un projet en début de projet"]),
      correctAnswer: 1,
      explanation: "L'EVM (Earned Value Management) intègre périmètre, planning et coûts pour mesurer objectivement l'avancement du projet et anticiper les dérives budgétaires et calendaires.",
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 5 — Réseaux et infrastructures
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[5], notion: "Modèle OSI et TCP/IP",
      question: "Le modèle OSI comporte combien de couches ?",
      options: json(["4 couches", "5 couches", "7 couches", "10 couches"]),
      correctAnswer: 2,
      explanation: "Le modèle OSI comprend 7 couches : 1-Physique, 2-Liaison, 3-Réseau, 4-Transport, 5-Session, 6-Présentation, 7-Application.",
    },
    {
      chapterId: ch[5], notion: "Modèle OSI et TCP/IP",
      question: "Qu'est-ce qu'une adresse IP ?",
      options: json(["L'adresse physique d'un ordinateur gravée en usine", "Un identifiant logique unique attribué à chaque interface réseau pour la communication", "Le nom de domaine d'un serveur web", "L'adresse MAC d'une carte réseau"]),
      correctAnswer: 1,
      explanation: "Une adresse IP est un identifiant logique attribué à chaque équipement connecté. IPv4 utilise 32 bits (ex: 192.168.1.1), IPv6 utilise 128 bits.",
    },
    {
      chapterId: ch[5], notion: "Cloud computing",
      question: "Le cloud computing de type SaaS (Software as a Service) signifie :",
      options: json(["L'entreprise héberge ses propres serveurs dans un datacenter tiers", "L'entreprise loue uniquement l'infrastructure (serveurs, stockage, réseau)", "L'entreprise accède à des applications via internet sans installation locale", "L'entreprise développe ses propres applications dans le cloud"]),
      correctAnswer: 2,
      explanation: "En SaaS, l'utilisateur accède à des applications hébergées dans le cloud via un navigateur, sans installation ni maintenance locale. Ex : Google Workspace, Microsoft 365, Salesforce.",
    },
    {
      chapterId: ch[5], notion: "Architectures réseau (LAN, WAN)",
      question: "Un VPN (Virtual Private Network) permet de :",
      options: json(["Accélérer la vitesse de connexion internet", "Créer un tunnel sécurisé et chiffré entre deux points sur un réseau public comme internet", "Filtrer les contenus web pour les utilisateurs", "Connecter physiquement deux réseaux distants par fibre optique"]),
      correctAnswer: 1,
      explanation: "Le VPN crée un tunnel crypté sur internet, permettant d'accéder au réseau privé de façon sécurisée depuis n'importe où. Largement utilisé pour le télétravail.",
    },
    {
      chapterId: ch[5], notion: "Services réseau (DNS, DHCP, HTTP)",
      question: "Le rôle d'un serveur DNS est de :",
      options: json(["Distribuer des adresses IP dynamiquement aux équipements", "Traduire les noms de domaine (ex: www.google.com) en adresses IP", "Filtrer le trafic réseau entrant et sortant", "Gérer les boîtes mail des utilisateurs"]),
      correctAnswer: 1,
      explanation: "Le DNS (Domain Name System) traduit les noms de domaine lisibles par l'humain en adresses IP compréhensibles par les machines. Sans DNS, il faudrait mémoriser toutes les adresses IP.",
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 6 — Les bases de données
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[6], notion: "Modèle relationnel et clés",
      question: "Dans le modèle relationnel, une clé primaire est :",
      options: json(["La première colonne de la table", "Un attribut ou ensemble d'attributs qui identifie de façon unique chaque enregistrement d'une table", "Une colonne qui peut contenir des valeurs nulles", "Un lien vers une autre table"]),
      correctAnswer: 1,
      explanation: "La clé primaire (PRIMARY KEY) identifie de manière unique chaque ligne d'une table. Elle ne peut pas être nulle et doit être unique. Souvent un identifiant numérique auto-incrémenté.",
    },
    {
      chapterId: ch[6], notion: "Modèle relationnel et clés",
      question: "Qu'est-ce qu'une clé étrangère dans une base de données relationnelle ?",
      options: json(["Une clé de chiffrement externe", "Un attribut d'une table qui référence la clé primaire d'une autre table, permettant de lier les données", "Un index unique sur une colonne", "Une clé primaire importée d'une autre base de données"]),
      correctAnswer: 1,
      explanation: "Une clé étrangère (FOREIGN KEY) référence la clé primaire d'une autre table, établissant une relation entre tables et garantissant l'intégrité référentielle.",
    },
    {
      chapterId: ch[6], notion: "Langage SQL",
      question: "La requête SQL « SELECT * FROM Clients WHERE Ville = 'Paris' » permet de :",
      options: json(["Supprimer tous les clients de Paris", "Mettre à jour la ville de tous les clients", "Afficher toutes les colonnes des clients dont la ville est Paris", "Compter le nombre de clients à Paris"]),
      correctAnswer: 2,
      explanation: "SELECT * sélectionne toutes les colonnes, FROM Clients indique la table, WHERE Ville = 'Paris' filtre les lignes. C'est une requête de sélection et de projection.",
    },
    {
      chapterId: ch[6], notion: "Langage SQL",
      question: "Une jointure INNER JOIN entre deux tables retourne :",
      options: json(["Toutes les lignes de la table gauche même sans correspondance à droite", "Toutes les lignes des deux tables combinées", "Uniquement les lignes ayant une correspondance dans les deux tables", "La différence entre les deux tables"]),
      correctAnswer: 2,
      explanation: "L'INNER JOIN retourne uniquement les lignes qui ont une correspondance dans les deux tables selon la condition de jointure. Les lignes sans correspondance sont exclues.",
    },
    {
      chapterId: ch[6], notion: "SGBD et propriétés ACID",
      question: "Les propriétés ACID d'un SGBD garantissent :",
      options: json(["La performance des requêtes SQL", "La sécurité physique des serveurs", "La fiabilité des transactions (Atomicité, Cohérence, Isolation, Durabilité)", "La compression des données stockées"]),
      correctAnswer: 2,
      explanation: "ACID : Atomicité (tout ou rien), Cohérence (état valide garanti), Isolation (transactions concurrentes non interférentes), Durabilité (transaction validée = permanente).",
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 7 — ERP / PGI
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[7], notion: "Définition et fonctionnalités ERP",
      question: "Un ERP (Enterprise Resource Planning) ou PGI est :",
      options: json(["Un logiciel spécialisé dans un seul domaine (comptabilité uniquement)", "Un système d'information intégré couvrant plusieurs processus métier dans une base de données unique", "Un outil de Business Intelligence pour l'analyse de données", "Un réseau social interne à l'entreprise"]),
      correctAnswer: 1,
      explanation: "Un ERP/PGI intègre l'ensemble des processus opérationnels (achats, ventes, production, RH, comptabilité…) dans une base de données unique, éliminant redondances et garantissant la cohérence.",
    },
    {
      chapterId: ch[7], notion: "Avantages et inconvénients",
      question: "L'un des principaux avantages d'un ERP est :",
      options: json(["Sa faible complexité d'implémentation", "Son coût d'acquisition très bas", "L'unicité de l'information et l'élimination des redondances entre services", "Sa facilité de personnalisation sans coût supplémentaire"]),
      correctAnswer: 2,
      explanation: "L'avantage majeur d'un ERP est l'intégration : une donnée saisie une seule fois est accessible à tous les modules autorisés, éliminant les ressaisies et garantissant la cohérence.",
    },
    {
      chapterId: ch[7], notion: "Implémentation d'un ERP",
      question: "L'implémentation d'un ERP nécessite généralement :",
      options: json(["Seulement l'installation du logiciel sans adaptation des processus", "Un paramétrage important, souvent une réorganisation des processus métier et une formation des utilisateurs", "Uniquement le remplacement du matériel informatique", "Un développement from scratch par les équipes internes"]),
      correctAnswer: 1,
      explanation: "L'implémentation d'un ERP est un projet complexe nécessitant : paramétrage approfondi, souvent une réingénierie des processus (BPR), migration des données et formation intensive.",
    },
    {
      chapterId: ch[7], notion: "Implémentation d'un ERP",
      question: "Le paramétrage d'un ERP consiste à :",
      options: json(["Modifier le code source du logiciel", "Configurer l'ERP pour l'adapter aux besoins de l'entreprise, sans modifier le code source", "Installer des modules complémentaires payants", "Connecter l'ERP à internet"]),
      correctAnswer: 1,
      explanation: "Le paramétrage configure l'ERP via ses interfaces dédiées (tables de paramétrage, droits utilisateurs, workflows) pour l'adapter à l'entreprise, sans toucher au code source.",
    },
    {
      chapterId: ch[7], notion: "Définition et fonctionnalités ERP",
      question: "SAP, Oracle ERP Cloud et Microsoft Dynamics 365 sont des exemples de :",
      options: json(["Systèmes de gestion de bases de données", "Logiciels de CRM uniquement", "Environnements de développement intégrés", "Progiciels de Gestion Intégrés (ERP/PGI)"]),
      correctAnswer: 3,
      explanation: "SAP, Oracle ERP Cloud et Microsoft Dynamics 365 sont parmi les ERP les plus utilisés. Ils couvrent typiquement : finance, RH, achats, ventes, production, logistique.",
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 8 — SI Décisionnel
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[8], notion: "Data Warehouse",
      question: "Un Data Warehouse (entrepôt de données) est :",
      options: json(["Un serveur de stockage physique de grande capacité", "Un système orienté sujet, intégré, non-volatile et historisé pour le support à la décision", "Une base de données relationnelle classique optimisée pour les transactions", "Un outil de visualisation de données"]),
      correctAnswer: 1,
      explanation: "Le Data Warehouse (Bill Inmon, 1990) : Orienté sujet (domaine métier), Intégré (données uniformisées), Non volatile (pas de suppression), Historisé (conservation de l'historique).",
    },
    {
      chapterId: ch[8], notion: "OLAP et cubes de données",
      question: "L'analyse OLAP se distingue d'OLTP car :",
      options: json(["OLAP traite des transactions unitaires en temps réel, OLTP est pour l'analyse", "OLAP est conçu pour l'analyse multidimensionnelle de grandes masses de données historiques, OLTP pour les transactions quotidiennes", "OLAP est plus rapide qu'OLTP pour les insertions de données", "Il n'y a pas de différence significative entre OLAP et OLTP"]),
      correctAnswer: 1,
      explanation: "OLTP gère les transactions opérationnelles quotidiennes (commandes, factures). OLAP est optimisé pour l'analyse de grandes quantités de données historiques selon plusieurs dimensions.",
    },
    {
      chapterId: ch[8], notion: "Tableaux de bord et KPI",
      question: "Un KPI (Key Performance Indicator) est :",
      options: json(["Un logiciel de reporting", "Un indicateur clé de performance permettant de mesurer l'atteinte des objectifs stratégiques", "Une méthode de calcul du ROI", "Un outil de visualisation graphique"]),
      correctAnswer: 1,
      explanation: "Un KPI est un indicateur mesurable reflétant l'atteinte d'un objectif critique. Il doit être SMART : Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini.",
    },
    {
      chapterId: ch[8], notion: "Business Intelligence",
      question: "La Business Intelligence (BI) regroupe :",
      options: json(["Les activités de renseignement économique et d'espionnage", "L'ensemble des méthodes et outils permettant de collecter, analyser et présenter les données pour la prise de décision", "Les activités de veille concurrentielle uniquement", "Les outils de gestion de la relation client (CRM)"]),
      correctAnswer: 1,
      explanation: "La BI (informatique décisionnelle) englobe : ETL, Data Warehouse, cubes OLAP, outils de reporting, tableaux de bord et data mining, pour aider à la prise de décision.",
    },
    {
      chapterId: ch[8], notion: "Data Warehouse",
      question: "Le processus ETL dans un Data Warehouse signifie :",
      options: json(["Enterprise Technology Lab", "Extract, Transform, Load : extraction, transformation et chargement des données dans l'entrepôt", "Electronic Transfer Language", "Evaluation, Testing, Launch"]),
      correctAnswer: 1,
      explanation: "ETL : Extract (extraction des sources : ERP, CRM, fichiers), Transform (nettoyage, uniformisation, agrégats), Load (chargement dans l'entrepôt). C'est le processus d'alimentation du Data Warehouse.",
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 9 — Sécurité des SI
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[9], notion: "Menaces et vulnérabilités",
      question: "Une attaque par phishing (hameçonnage) consiste à :",
      options: json(["Saturer un serveur de requêtes pour le rendre indisponible", "Tromper un utilisateur par un faux message pour lui voler ses identifiants ou données sensibles", "Exploiter une faille dans le code d'un logiciel", "Intercepter des communications réseau non chiffrées"]),
      correctAnswer: 1,
      explanation: "Le phishing est une technique d'ingénierie sociale utilisant de faux emails ou sites imitant des entités légitimes pour soutirer identifiants, numéros de CB ou autres données sensibles.",
    },
    {
      chapterId: ch[9], notion: "Politiques de sécurité",
      question: "Un pare-feu (firewall) a pour fonction principale de :",
      options: json(["Chiffrer les données stockées sur le disque dur", "Filtrer le trafic réseau entrant et sortant selon des règles définies, pour protéger le réseau interne", "Détecter les virus sur les postes utilisateurs", "Créer des sauvegardes automatiques des données"]),
      correctAnswer: 1,
      explanation: "Le pare-feu filtre le trafic réseau selon des règles (listes d'IP autorisées/bloquées, ports). Il constitue la première ligne de défense du réseau interne contre les menaces extérieures.",
    },
    {
      chapterId: ch[9], notion: "Plan de Continuité d'Activité (PCA)",
      question: "Le Plan de Continuité d'Activité (PCA) vise à :",
      options: json(["Planifier les projets informatiques de l'entreprise", "Garantir la continuité des activités critiques de l'entreprise en cas de sinistre ou incident majeur", "Gérer les mises à jour des logiciels de façon continue", "Assurer la continuité du service après-vente"]),
      correctAnswer: 1,
      explanation: "Le PCA est un ensemble de mesures préventives et réactives pour maintenir les processus métier critiques en cas de crise (incendie, inondation, cyberattaque…). Il inclut le PRA.",
    },
    {
      chapterId: ch[9], notion: "Cryptographie et authentification",
      question: "Le chiffrement asymétrique utilise :",
      options: json(["Une clé unique partagée entre l'émetteur et le récepteur", "Une paire de clés liées mathématiquement : une clé publique et une clé privée", "Un algorithme symétrique avec une clé de 256 bits", "Un mot de passe haché via SHA-256"]),
      correctAnswer: 1,
      explanation: "Le chiffrement asymétrique (RSA, ECC…) utilise une paire de clés : clé publique (pour chiffrer) et clé privée (pour déchiffrer). Base de HTTPS, signature électronique et certificats SSL.",
    },
    {
      chapterId: ch[9], notion: "Politiques de sécurité",
      question: "La politique de sécurité des systèmes d'information (PSSI) définit :",
      options: json(["Les procédures de sauvegarde des données uniquement", "L'ensemble des règles, procédures et bonnes pratiques pour protéger le SI de l'organisation", "La liste des logiciels autorisés dans l'entreprise", "Le budget alloué à la sécurité informatique"]),
      correctAnswer: 1,
      explanation: "La PSSI définit la vision de sécurité de l'organisation, les objectifs, les règles et procédures à respecter, les responsabilités de chacun et les sanctions en cas de non-respect.",
    },

    // ═══════════════════════════════════════════════════════════════════════
    // CHAPITRE 10 — Échanges électroniques
    // ═══════════════════════════════════════════════════════════════════════
    {
      chapterId: ch[10], notion: "EDI et formats d'échange",
      question: "L'EDI (Échange de Données Informatisé) est :",
      options: json(["Un réseau social professionnel", "Un protocole d'échange d'emails sécurisés", "L'échange automatisé et standardisé de documents commerciaux entre entreprises", "Un logiciel de comptabilité"]),
      correctAnswer: 2,
      explanation: "L'EDI permet l'échange électronique automatisé de documents structurés (commandes, factures, BL…) entre partenaires, selon des formats standardisés (EDIFACT, XML, ANSI X12).",
    },
    {
      chapterId: ch[10], notion: "Signature électronique",
      question: "La signature électronique est :",
      options: json(["Uniquement une image numérisée d'une signature manuscrite", "Un mécanisme cryptographique garantissant l'authenticité, l'intégrité et la non-répudiation d'un document", "Un code PIN associé à un email", "Une simple saisie du nom en caractères italiques dans un document"]),
      correctAnswer: 1,
      explanation: "La signature électronique (règlement eIDAS) garantit : authenticité du signataire, intégrité du document et non-répudiation (impossibilité de nier avoir signé).",
    },
    {
      chapterId: ch[10], notion: "Facture électronique",
      question: "La facture électronique (e-invoicing) B2B en France est :",
      options: json(["Facultative pour toutes les entreprises", "Déjà obligatoire pour toutes les entreprises depuis 2020", "En cours de déploiement progressif, obligatoire entre 2024 et 2026 selon la taille de l'entreprise", "Réservée aux grandes entreprises cotées en bourse"]),
      correctAnswer: 2,
      explanation: "La réforme de facturation électronique B2B prévoit un déploiement progressif : grandes entreprises en 2024, ETI en 2025, PME/TPE en 2026, avec un volet e-reporting à la DGFiP.",
    },
    {
      chapterId: ch[10], notion: "Dématérialisation",
      question: "La dématérialisation des documents consiste à :",
      options: json(["Supprimer définitivement tous les documents papier de l'entreprise", "Convertir les documents papier en numérique et gérer nativement les flux documentaires sous forme électronique", "Stocker uniquement les documents sur des serveurs distants", "Scanner les factures pour les envoyer par email sans valeur légale"]),
      correctAnswer: 1,
      explanation: "La dématérialisation remplace les flux papier par leurs équivalents numériques, avec la valeur légale assurée par la signature électronique et les systèmes d'archivage sécurisés.",
    },
    {
      chapterId: ch[10], notion: "E-commerce et e-procurement",
      question: "Le commerce électronique B2B (Business to Business) désigne :",
      options: json(["Les transactions entre une entreprise et ses clients particuliers via internet", "Les transactions commerciales entre entreprises via des plateformes électroniques", "La vente de produits numériques uniquement", "Le commerce entre gouvernements"]),
      correctAnswer: 1,
      explanation: "Le B2B désigne les échanges commerciaux électroniques entre entreprises : commandes, catalogues électroniques, marketplaces B2B, e-procurement (achat dématérialisé). Contrairement au B2C qui cible les particuliers.",
    },
  ]

  await prisma.mCQ.createMany({ data: mcqData })
  console.log(`✅ ${mcqData.length} questions QCM créées`)

  // ── QUESTIONS RÉDACTIONNELLES ─────────────────────────────────────────────
  const redactionData = [
    // ─── Chapitre 1 ──────────────────────────────────────────────────────────
    {
      chapterId: ch[1], maxScore: 15,
      title: "Définition et fonctions du SI",
      context: "La société COMPTAPLUS (50 salariés, distribution de fournitures de bureau) souhaite moderniser son système d'information pour améliorer ses performances.",
      question: "Définissez le concept de système d'information et précisez ses quatre fonctions essentielles. Illustrez chaque fonction par un exemple concret tiré d'une entreprise de distribution.",
      gradingGrid: `Barème sur 15 points :
1. Définition du SI (3 pts) : ensemble organisé de ressources (humaines, matérielles, logicielles, procédures) permettant de collecter, stocker, traiter et diffuser l'information. Pénalité si réduit au seul aspect informatique.
2. Fonction de collecte (2 pts) : saisie des commandes clients, scanning des codes-barres, relevés des ventes POS.
3. Fonction de mémorisation/stockage (2 pts) : base de données clients, fichier articles, historique des commandes.
4. Fonction de traitement (3 pts) : calcul des prix, gestion des stocks, facturation automatique, statistiques de ventes.
5. Fonction de diffusion (2 pts) : envoi des factures aux clients, transmission des commandes aux fournisseurs, rapports à la direction.
6. Qualité des exemples et cohérence avec l'activité de distribution (3 pts).`,
    },
    {
      chapterId: ch[1], maxScore: 10,
      title: "SI vs Système informatique",
      context: null,
      question: "Distinguez le système d'information du système informatique. Pourquoi peut-on dire que le SI est plus large que le système informatique ? Donnez deux exemples de composantes du SI qui ne relèvent pas du système informatique.",
      gradingGrid: `Barème sur 10 points :
1. Définition du SI (2 pts) : ensemble de ressources humaines, organisationnelles ET techniques.
2. Définition du système informatique (2 pts) : sous-ensemble du SI constitué des équipements matériels et logiciels.
3. Distinction claire (3 pts) : le SI inclut ressources humaines (opérateurs, gestionnaires), procédures, documents papier, savoir-faire organisationnel.
4. Deux exemples pertinents (2 pts) : procédures manuelles de traitement, formulaires papier, réunions de coordination, transmission verbale d'informations.
5. Qualité de la rédaction (1 pt).`,
    },

    // ─── Chapitre 2 ──────────────────────────────────────────────────────────
    {
      chapterId: ch[2], maxScore: 20,
      title: "Modélisation MCD — Gestion d'une bibliothèque",
      context: "Une bibliothèque municipale souhaite informatiser la gestion de ses prêts. Un adhérent peut emprunter plusieurs ouvrages. Un ouvrage peut exister en plusieurs exemplaires. Chaque exemplaire appartient à un seul ouvrage. Un prêt concerne un exemplaire et un adhérent, pour une durée donnée.",
      question: "1) Identifiez les entités et leurs attributs principaux. 2) Identifiez les associations et précisez les cardinalités. 3) Dressez le MCD correspondant. 4) Effectuez le passage au MLD (modèle logique de données).",
      gradingGrid: `Barème sur 20 points :
1. Entités et attributs (5 pts) : Adhérent (NumAdhérent, Nom, Prénom, Adresse, DateInscription), Ouvrage (ISBN, Titre, Auteur, Genre), Exemplaire (NumExemplaire, État), Prêt (DateEmprunt, DateRetourPrévue, DateRetourEffective).
2. Associations et cardinalités (5 pts) : ADHÉRENT-(0,N)—EMPRUNTER—(0,N)-EXEMPLAIRE via entité-association PRÊT ; OUVRAGE-(1,N)—POSSÉDER—(0,1)-EXEMPLAIRE. Pénalité si cardinalités incorrectes.
3. MCD dessiné correctement (5 pts) : entités rectangulaires, associations ovales, cardinalités sur chaque côté.
4. Passage MLD (5 pts) : Adhérent(NumAdhérent, Nom, Prénom, Adresse, DateInscription), Ouvrage(ISBN, Titre, Auteur, Genre), Exemplaire(NumExemplaire, ISBN#, État), Prêt(NumPrêt, NumExemplaire#, NumAdhérent#, DateEmprunt, DateRetourPrévue, DateRetourEffective). Clés primaires soulignées, clés étrangères (#).`,
    },
    {
      chapterId: ch[2], maxScore: 10,
      title: "Diagramme de flux",
      context: "La société MOBILIER SA traite les commandes clients selon le processus suivant : le client envoie une commande au service commercial. Le commercial vérifie la disponibilité des articles auprès du service stock. Si les articles sont disponibles, le commercial confirme la commande au client et transmet le bon de préparation au service livraison. Le service livraison prépare et expédie la commande, puis transmet le bon de livraison à la comptabilité qui émet la facture au client.",
      question: "Représentez le diagramme de flux de ce processus en identifiant les acteurs, les flux et leur sens.",
      gradingGrid: `Barème sur 10 points :
1. Identification des acteurs (3 pts) : Client (externe), Service Commercial, Service Stock, Service Livraison, Service Comptabilité.
2. Flux correctement identifiés et nommés (4 pts) : Commande (Client→Commercial), Demande disponibilité (Commercial→Stock), Réponse disponibilité (Stock→Commercial), Confirmation commande (Commercial→Client), Bon de préparation (Commercial→Livraison), Livraison+BL (Livraison→Client), BL (Livraison→Compta), Facture (Compta→Client).
3. Sens des flèches correct (2 pts).
4. Présentation et lisibilité du diagramme (1 pt).`,
    },

    // ─── Chapitre 3 ──────────────────────────────────────────────────────────
    {
      chapterId: ch[3], maxScore: 15,
      title: "RGPD — Mise en conformité",
      context: "La société BEAUTÉ&CO collecte des données personnelles de ses clients pour gérer leurs commandes, leur envoyer des newsletters et analyser leurs comportements d'achat. Un audit révèle qu'aucune politique de protection des données n'est en place.",
      question: "1) Citez les principes fondamentaux du RGPD que BEAUTÉ&CO doit respecter. 2) Quelles obligations concrètes BEAUTÉ&CO doit-elle mettre en place ? 3) Quelles sont les sanctions encourues en cas de non-respect ?",
      gradingGrid: `Barème sur 15 points :
1. Principes RGPD (5 pts) : licéité/loyauté/transparence, limitation des finalités, minimisation des données, exactitude, limitation de conservation, intégrité/confidentialité, responsabilité (accountability). 1 pt par principe cité correctement, max 5.
2. Obligations concrètes (6 pts) : registre des traitements, politique de confidentialité, consentement explicite pour la newsletter, droit d'accès/rectification/effacement des personnes, nomination d'un DPO si nécessaire, notification des violations de données à la CNIL sous 72h, contrats avec sous-traitants.
3. Sanctions (4 pts) : avertissement, mise en demeure de la CNIL, amende jusqu'à 20 millions d'euros OU 4% du chiffre d'affaires annuel mondial (le montant le plus élevé), sanctions pénales possibles.`,
    },

    // ─── Chapitre 4 ──────────────────────────────────────────────────────────
    {
      chapterId: ch[4], maxScore: 15,
      title: "Gestion de projet — Méthodes et acteurs",
      context: "L'entreprise TRANSPORT EXPRESS décide de déployer un nouveau logiciel de gestion des tournées de livraison. Le projet est estimé à 18 mois et implique le service informatique interne et un prestataire externe.",
      question: "1) Distinguez la MOA et la MOE dans ce projet. 2) Citez les 5 étapes principales d'un projet informatique selon la méthode classique (cycle en V ou cascade). 3) Quels sont les avantages d'une approche Agile par rapport à la méthode classique pour ce type de projet ?",
      gradingGrid: `Barème sur 15 points :
1. MOA/MOE (4 pts) : MOA = TRANSPORT EXPRESS (direction + utilisateurs métier) qui exprime les besoins, valide et finance ; MOE = prestataire externe (+ DSI interne éventuelle) qui conçoit, développe et livre. Rôle de l'AMOA si mentionné (1 pt bonus).
2. Étapes projet classique (6 pts : 1 pt × 6) : Expression des besoins/faisabilité, Spécifications fonctionnelles (CdCF), Conception technique, Développement/réalisation, Tests et recette, Déploiement/mise en production (+maintenance).
3. Avantages Agile (5 pts) : livraisons itératives (valeur plus tôt), adaptation au changement (vs rigidité cascade), collaboration MOA/MOE permanente, détection précoce des anomalies, meilleure appropriation par les utilisateurs. 1 pt par avantage correctement développé.`,
    },

    // ─── Chapitre 6 ──────────────────────────────────────────────────────────
    {
      chapterId: ch[6], maxScore: 20,
      title: "SQL — Requêtes sur une base de données de gestion commerciale",
      context: `La base de données VENTES comporte les tables suivantes :
- CLIENTS(NumClient, Nom, Ville, CA_Annuel)
- COMMANDES(NumCommande, NumClient#, DateCommande, Montant)
- PRODUITS(NumProduit, Désignation, Prix, Stock)
- LIGNES_COMMANDE(NumCommande#, NumProduit#, Quantité, PrixUnitaire)`,
      question: "Rédigez les requêtes SQL permettant de : 1) Afficher le nom et la ville de tous les clients de Lyon. 2) Calculer le montant total des commandes par client (avec le nom du client). 3) Lister les produits dont le stock est inférieur à 10, triés par stock croissant. 4) Afficher les commandes du mois de janvier 2024 avec le nom du client correspondant.",
      gradingGrid: `Barème sur 20 points (5 pts par requête) :
1. SELECT Nom, Ville FROM CLIENTS WHERE Ville = 'Lyon'; (5 pts : SELECT 1pt, FROM 1pt, WHERE 3pts)
2. SELECT C.Nom, SUM(CO.Montant) AS Total FROM CLIENTS C INNER JOIN COMMANDES CO ON C.NumClient = CO.NumClient GROUP BY C.NumClient, C.Nom; (5 pts : jointure 2pts, SUM+GROUP BY 2pts, alias 1pt)
3. SELECT NumProduit, Désignation, Stock FROM PRODUITS WHERE Stock < 10 ORDER BY Stock ASC; (5 pts : WHERE 2pts, ORDER BY 2pts, colonnes 1pt)
4. SELECT CO.NumCommande, C.Nom, CO.DateCommande, CO.Montant FROM COMMANDES CO INNER JOIN CLIENTS C ON CO.NumClient = C.NumClient WHERE CO.DateCommande BETWEEN '2024-01-01' AND '2024-01-31'; (5 pts : jointure 2pts, WHERE date 2pts, colonnes 1pt)`,
    },

    // ─── Chapitre 7 ──────────────────────────────────────────────────────────
    {
      chapterId: ch[7], maxScore: 15,
      title: "ERP — Avantages, inconvénients et facteurs de succès",
      context: "La PME MÉTALLURGIE DUPONT (200 salariés) utilise actuellement 6 logiciels distincts non intégrés pour gérer sa comptabilité, ses achats, ses ventes, sa production, ses RH et ses stocks. La direction envisage de déployer un ERP.",
      question: "1) Expliquez pourquoi la situation actuelle de MÉTALLURGIE DUPONT est problématique (3 problèmes minimum). 2) Citez 4 avantages qu'apporterait la mise en place d'un ERP. 3) Identifiez 3 risques ou inconvénients majeurs d'un projet ERP. 4) Citez 2 facteurs clés de succès d'un déploiement ERP.",
      gradingGrid: `Barème sur 15 points :
1. Problèmes situation actuelle (3 pts) : redondances/saisies multiples (risque d'erreurs), manque de cohérence des données entre applications, vision fragmentée de l'activité, interfaces entre logiciels complexes et coûteuses, délais de traitement allongés.
2. Avantages ERP (4 pts : 1 pt × 4) : unicité de l'information, vision temps réel de l'activité, automatisation des flux inter-services, traçabilité complète, réduction des erreurs de ressaisie, aide à la décision par reporting intégré, conformité réglementaire facilitée.
3. Risques/inconvénients (3 pts : 1 pt × 3) : coût élevé (licences + implémentation + formation), durée et complexité du projet, résistance au changement des utilisateurs, dépendance vis-à-vis de l'éditeur, rigidité des processus imposés par l'ERP.
4. Facteurs de succès (3 pts : 1,5 pt × 2) : implication forte de la direction (sponsorship), conduite du changement et formation des utilisateurs, nettoyage et migration soignée des données existantes, définition claire du périmètre et des objectifs.
5. Qualité de la rédaction et du vocabulaire (2 pts).`,
    },

    // ─── Chapitre 8 ──────────────────────────────────────────────────────────
    {
      chapterId: ch[8], maxScore: 15,
      title: "SI Décisionnel — Data Warehouse et BI",
      context: "GRANDE SURFACE SA dispose d'un ERP pour la gestion opérationnelle et souhaite mettre en place un système décisionnel pour analyser les ventes par rayon, région et période, et prendre de meilleures décisions d'approvisionnement.",
      question: "1) Définissez le Data Warehouse et expliquez en quoi il se distingue de la base de données opérationnelle de l'ERP. 2) Décrivez le processus ETL en précisant le rôle de chaque étape. 3) Qu'est-ce qu'un tableau de bord de pilotage ? Citez 3 KPI pertinents pour GRANDE SURFACE SA.",
      gradingGrid: `Barème sur 15 points :
1. Data Warehouse vs BDD opérationnelle (5 pts) : DW = orienté sujet, intégré (données de plusieurs sources), non volatile (pas de suppression), historisé (évolution dans le temps), optimisé pour la lecture analytique. BDD opérationnelle = gestion des transactions courantes, données actuelles, optimisée pour les écritures rapides. Distinction claire obligatoire.
2. Processus ETL (5 pts) : Extract (2 pts) = extraction des données depuis les sources (ERP, caisses, logistique) ; Transform (2 pts) = nettoyage, standardisation, enrichissement, calcul d'agrégats ; Load (1 pt) = chargement dans l'entrepôt selon une périodicité définie (nuit, semaine).
3. Tableau de bord et KPI (5 pts) : définition tableau de bord (2 pts) = outil de pilotage présentant des indicateurs synthétiques. KPI pertinents pour GSA (3 pts : 1 pt × 3) : CA par rayon/par région/par période, taux de rotation des stocks, marge brute par catégorie, taux de rupture de stock, panier moyen client.`,
    },

    // ─── Chapitre 9 ──────────────────────────────────────────────────────────
    {
      chapterId: ch[9], maxScore: 15,
      title: "Sécurité SI — Politique de sécurité et PCA",
      context: "La société BANQUE RÉGIONALE subit une cyberattaque par ransomware qui chiffre l'ensemble de ses données et rend son SI indisponible pendant 3 jours. La DSI est chargée de tirer les enseignements de cet incident.",
      question: "1) Définissez le ransomware et expliquez son mode d'action. 2) Quelles mesures préventives auraient pu limiter l'impact de cette attaque ? (4 minimum) 3) Qu'est-ce qu'un PCA et un PRA ? En quoi sont-ils essentiels pour une banque ?",
      gradingGrid: `Barème sur 15 points :
1. Définition ransomware (3 pts) : logiciel malveillant (malware) qui chiffre les données de la victime et exige une rançon (souvent en cryptomonnaie) en échange de la clé de déchiffrement. Mode d'action : intrusion (phishing, faille), propagation sur le réseau, chiffrement des fichiers, affichage de la demande de rançon.
2. Mesures préventives (7 pts : 1,5 pt × 4 min) : sauvegardes régulières et déconnectées (règle 3-2-1), mises à jour et correctifs de sécurité, sensibilisation/formation des utilisateurs (anti-phishing), segmentation du réseau (limiter la propagation), solution EDR/antivirus à jour, authentification multi-facteurs (MFA), pare-feu et filtrage des emails.
3. PCA et PRA (5 pts) : PCA (2 pts) = Plan de Continuité d'Activité : ensemble des mesures pour maintenir les activités critiques pendant le sinistre (serveurs de secours, basculement). PRA (2 pts) = Plan de Reprise d'Activité : procédures pour restaurer le SI à un état normal après l'incident (délai de reprise, RPO/RTO). Importance pour une banque (1 pt) : continuité du service réglementaire (BÂLE III), protection des fonds et données clients, obligations légales de disponibilité.`,
    },

    // ─── Chapitre 10 ─────────────────────────────────────────────────────────
    {
      chapterId: ch[10], maxScore: 15,
      title: "Échanges électroniques — Facture électronique et EDI",
      context: "La société IMPORT-EXPORT SA réalise 80% de ses échanges commerciaux avec des partenaires étrangers et se prépare à la réforme de la facturation électronique obligatoire.",
      question: "1) Définissez l'EDI et expliquez ses avantages par rapport à l'échange papier traditionnel. 2) Qu'est-ce que la signature électronique ? Quelles sont ses fonctions juridiques ? 3) Présentez les enjeux de la réforme de la facturation électronique B2B en France pour IMPORT-EXPORT SA.",
      gradingGrid: `Barème sur 15 points :
1. EDI et avantages (5 pts) : définition EDI (2 pts) = échange automatisé et standardisé de documents commerciaux entre systèmes informatiques de partenaires, selon des formats normalisés (EDIFACT, XML). Avantages (3 pts) : rapidité (traitement en temps réel), élimination des ressaisies (erreurs), réduction des coûts de traitement, traçabilité des échanges, intégration directe dans les SI partenaires.
2. Signature électronique (5 pts) : définition (2 pts) = mécanisme cryptographique basé sur un certificat numérique. Fonctions juridiques (3 pts) : authenticité (identification du signataire), intégrité (garantie que le document n'a pas été modifié), non-répudiation (impossibilité de nier la signature). Règlement eIDAS si mentionné (bonus 0,5 pt).
3. Réforme facturation électronique (5 pts) : calendrier déploiement progressif 2024-2026 selon taille (2 pts), obligation d'émettre ET de recevoir des factures électroniques via plateformes homologuées (PDP) ou portail public (Chorus Pro) (2 pts), enjeux pour IMPORT-EXPORT SA : mise à niveau du SI, choix d'une PDP, formation des équipes comptables, conformité avec les obligations de e-reporting à la DGFiP (1 pt).`,
    },
  ]

  await prisma.redactionQuestion.createMany({ data: redactionData })
  console.log(`✅ ${redactionData.length} questions rédactionnelles créées`)

  // ── RÉSUMÉ ────────────────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ SEED TERMINÉ AVEC SUCCÈS')
  console.log(`   ${studentData.length} étudiants (ID0001→ID0034 + DEMO)`)
  console.log(`   10 chapitres`)
  console.log(`   ${mcqData.length} questions QCM`)
  console.log(`   ${redactionData.length} questions rédactionnelles`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  console.log('Connexion de test : ID0001 / XX11  ou  DEMO / DEMO')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

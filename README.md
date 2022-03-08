# Shelf

![CatReadingGif](https://media.giphy.com/media/3R9LDINpbGX2o/giphy.gif)

Shelf est une API REST utilisant [NestJs](https://nestjs.com/) proposant à un lecteur d’enregistrer les livres
qu’il a lus au cours de sa vie, dans sa bibliothèque virtuelle.

L'api utilise l'ORM TypeORM qui permet de gérer la persistence des entités facilement et de gérer le versioning
de la base de données via des **migrations**.

## Installation

```bash
$ npm install
```

Renommer le fichier `.env.exemple` par `.env`
et remplacer les variables relatives à la base de données et à Minio:

```dotenv
.env

DB_TYPE=mysql
DB_HOST=shelf_db
DB_PORT=3306
DB_DATABASE=dbname
DB_USERNAME=user
DB_PASSWORD=pwd

STORAGE_ENDPOINT=minio
STORAGE_PORT=9000
STORAGE_USER=shelf
STORAGE_PASSWORD=secure_password
STORAGE_BUCKET=shelf
```

Aller sur l'interface web **Minio Console** http://localhost:9001 puis entrer les identifiants correspondants 
aux variables d'environnement `STORAGE_USER` et `STORAGE_PASSWORD` (cf. `.env`).
Créer un nouveau **Bucket** nommé selon `STORAGE_BUCKET`.
Minio est prêt à être utilisé.

## Démarrage

```bash
# development
$ docker compose up app
```

## Fonctionnalités de l’application

- [x] Afficher ses livres
- [x] Afficher les détails d'un livre
- [x] Ajouter un livre
- [x] Modifier un livre
- [x] Supprimer un livre
- [x] Valider l'ISBN via une api externe
- [x] Multiplicité de bibliothèques
- [ ] Inscription / Connexion
- [x] Stockage des images avec [Minio](https://hub.docker.com/r/minio/minio/)

### Routes

| Méthode   | Chemin                  | Status Normal | Description                                    |
|-----------|-------------------------|---------------|------------------------------------------------|
| `GET`     | `/books`                | 200           | Récupère tous les livres                       |
| `GET`     | `/books/:isbn`          | 200           | Récupère un livre par son ISBN                 |
| `GET`     | `/books/:isbn/cover`    | 200           | Récupère l'image de couverture d'un livre      |
| `POST`    | `/books`                | 201           | Ajoute un livre                                |
| `PATCH`   | `/books/:isbn`          | 200           | Modifie un livre                                |
| `DELETE`  | `/books/:isbn`          | 204           | Supprime un livre                              |
| `GET`     | `/libraries`            | 200           | Récupère toutes les bibliothèques              |
| `GET`     | `/libraries/:uuid`      | 200           | Récupère un bibliothèque par son UUID          |
| `POST`    | `/libraries`            | 201           | Crée une bibliothèque                          |
| `PATCH`   | `/libraries/:uuid`      | 200           | Modifie la liste des livres d'une bibliothèque  |
| `DELETE`  | `/libraries/:uuid`      | 204           | Supprime une bibliothèque                      |
| `DELETE`  | `/libraries/book/:isbn` | 204           | Retire un livre de toutes les bibliothèques    |

---

## Versioning

### Gitflow

Le worflow utilisé est le **Gitflow**, c'est-à-dire les branches :

- main
- develop
- feature/...
- fix/...

Les noms des commits sont en anglais.

### [Github](https://github.com/NightTheo/shelf)

Le Gitflow est associé à l'utilisation de **pull requests**.
Chaque nouveau développement ou correction doit faire suite à la création d'une **issue**
liée à une **Pull Request**.
La Pull Request doit avoir deux approbations pour être appliquée sur la branche develop.
Les branches sont supprimées lorsque la pull request est acceptée.

Chaque issue doit expliquer ce qu'il faut faire ou ce qui doit être corrigé.
Elle doit avoir au moins un `Label` parmi :
- enhancement
- documentation
- bug
- configuration
- invalid

Le repository possède le [projet shelf](https://github.com/NightTheo/shelf/projects/1) qui est un Kanban à 4 colonnes :
- To do
- In progress
- In review
- Done

Le repository possède le milestone [Alpha](https://github.com/NightTheo/shelf/milestone/1):

Il correspond au développement de la version 1.0.0 comprenant les fonctionnalités de base et les bonus :

gérer plusieurs bibliothèques, stocker les images des livres en utilisant Minio et valider l’ISBN du livre via une 
api externe.


### [Changelog](./CHANGELOG.md)

Les modifications notables apportées y sont renseignées.
Le projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html), visible dans 
le changelog et dans le `package.json`.
Le changelog du projet démarre à la version 0.4.0, car à l'ajout, les quatre fonctionnalités : 
récupérer tous les livres, récupérer/modifier/supprimer un livre étaient déjà implémentés.




### Sécurité

Tous les commits sont vérifiés par le biais de clés GPG.

Les branches main et develop sont protégées par des règles :

- Chaque merge sur main et develop doivent passer par une pull-request
- Ces pull-request nécessitent au moins deux Approvals pour être merge

## Contribuer

La documentation de l’exécution de votre application via l’environnement de développement sous docker-compose
```bash
$ docker compose up app
```

### [docker-compose](./docker-compose.yml) possède 3 services:

#### [Minio](https://hub.docker.com/r/minio/minio/)

MinIO est un Object Storage compatible avec Amazon S3 cloud storage.
Il est utilisé pour stocker les images de couverture des livres.

Le conteneur est nommé `minio`.

Le service prend la commande :
```bash
server --console-address ":9001" /data
```
Qui lance le service de MinIO avec pour chemin de stockage dans le conteneur `/data`.
On définit aussi le port de console qui est l'interface web permettant de gérer le stockage.
Minio utilise par défaut le port `:9000` et le port de console définit ici est donc `:9001`, 
il ne faut donc pas oublier de lier les ports 9000 et 9001 à des ports locaux.

Il est souhaitable que les fichiers envoyés sur MinIO soient persisté, un volume nommé `shelf_minio` est donc monté,
lié au chemin `/data` où sont stockés les données.

#### Base de données

Le service `db` pour a pour but de contenir la bose de données. Ce projet utilise MySQL avec l'image
[mysql:8.0](https://hub.docker.com/_/mysql).
Le conteneur prend principalement comme environnement le nom de la base de données, les identifiants.
De plus on affecte un mot de passe aléatoire à l'utilisateur root `MYSQL_RANDOM_ROOT_PASSWORD: yes`.

De même que pour MinIO, les données sont persistées grâce à un volume monté nommé `mysql` qui stock les données
dans le conteneur au chemin `/var/lib/mysql`.

#### Shelf
Le service `app` représente l'API. Le service utilise le [Dockerfile](./Dockerfile) à la racine du projet.
On crée une image `shelf:1.0.0` qui a un volume monté liant tout le répertoire du projet au 
workdir du Dockerfile `/usr/src/app`.

Depuis la version 3.4 du format de ficheir docker-compose, 
la propriété [target](https://docs.docker.com/compose/compose-file/compose-file-v3/#target) est disponible.
Elle permet de spécifier quelle partie du Dockerfile doit être exécuté.
Notre Dockerfile ne comporte qu'une seule partie `development` qui est choisie.

Le port exposé est le `:3000` car celui utilisé par défaut par NestJs.

L'application ne doit être lancée que lorsque la base de données et MinIO sont lancés, 
le service `app` dépend donc des services `db` et `minio`.


##### Volumes

Il y a en tout 3 volumes :
- named volume :
  - `mysql:/var/lib/mysql` dans `db`
  - `shelf_minio:/data dans` `minio`
- bind mount:
  - `.:/usr/src/app` dans `app`

##### Réseau

Les trois services sont dans le réseau `shelf` qui est en bridge.

##### Important

Il faut faire attention, lorsque l'on veut faire des appels entre conteneurs (connexion à la bdd, à minio), le host
à préciser n'est pas localhost mais bien le **nom du conteneur**. Docker gère cette résolution IP automatiquement.


## Déploiement

La documentation de l’exécution de votre application en production avec Docker

## Tests logiciels

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

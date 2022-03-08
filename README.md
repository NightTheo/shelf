# Shelf

![CatReadingGif](https://media.giphy.com/media/3R9LDINpbGX2o/giphy.gif)

Shelf est une API REST utilisant [NestJs](https://nestjs.com/) proposant à un lecteur d’enregistrer les livres
qu’il a lus au cours de sa vie, dans sa bibliothèque virtuelle.

## Installation

```bash
$ npm install
```

Renommer le fichier `.env.exemple` par `.env`
et remplacer les variables relatives à la base de données:

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
```

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

L'application est découpée en deux packages : Books et Libraries

### Books
Le lecteur peut afficher tous les livres qu’il a lus `GET /books`.

Le lecteur peut afficher les détails d’un livre `GET /books/:isbn`.

Le lecteur peut afficher l'image de couverture d’un livre `GET /books/:isbn/cover`.

Le lecteur peut ajouter un nouveau livre dans sa bibliothèque générale `POST /books`.

Le lecteur peut modifier un livre déjà présent dans sa bibliothèque `PATCH /books/:isbn` .

Le lecteur peut supprimer un livre de toutes ses bibliothèques. `DELETE /books/:isbn`.

### Libraries

Le lecteur peut afficher toutes les bibliothèques qu’il a `GET /libraries`.

Le lecteur peut afficher les livres présents dans une bibliothèque `GET /libraries/:uuid`.

Le lecteur peut créer une nouvelle bibliothèque `POST /libraries`.

Le lecteur peut modifier la liste des livres présents dans une bibliothèque `PATCH /libraries/:uuid` .

Le lecteur peut supprimer une de ses bibliothèques. `DELETE /libraries/:uuid`.

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

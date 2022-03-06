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
#.env

DB_HOST=shelf_db
DB_PORT=3306
DB_DATABASE=dbname
DB_USERNAME=user
DB_PASSWORD=pwd
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

### Bonnus

- [ ] Valider l'ISBN via une api externe
- [ ] Multiplicité de bibliothèques
- [ ] Inscription / Connexion
- [x] Stockage des images avec [Minio](https://hub.docker.com/r/minio/minio/)

## Versioning

### Gitflow

Le worflow utilisé est le **Gitflow**, c'est à dire les branches:

- main
- develop
- feature/...
- fix/...

Le Gitflow est associé à l'utilisation de **pull requests**.
Chaque nouveau développement ou correction doit faire suite à la création d'une **issue**
liée à une **Pull Request**.
La Pull Request doit avoir deux approbations pour être appliquée sur la branche develop.
Les branches sont supprimées lorsque la pull request est acceptée.

Le nom des commits sont en anglais.

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

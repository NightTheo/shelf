# Shelf
![CatReadingGif](https://media.giphy.com/media/3R9LDINpbGX2o/giphy.gif)

Shelf est une API REST utilisant [NestJs](https://nestjs.com/) proposant à un lecteur d’enregistrer les livres
qu’il a lus au cours de sa vie, dans sa bibliothèque virtuelle.

## Installation

## Fonctionnalités de l’application
- [ ] Afficher ses livres
- [ ] Afficher les détails d'un livre
- [ ] Ajouter un livre
- [ ] Modifier un livre
- [ ] Supprimer un livre

### Bonnus
- [ ] Valider l'ISBN
- [ ] Multiplicité de bibliothèques
- [ ] Inscription / Connexion
- [ ] Stockage des images avec [Minio](https://hub.docker.com/r/minio/minio/)

## Versioning
### Gitflow
Le worflow utilisé est le **Gitflow**, c'est à dire:
- main
- develop
- feature
- fix

Le Gitflow est associé à l'utilisation de **pull requests**. 
Chaque nouveau développement ou correction doit faire suite à la création d'une **issue**
liée à une **Pull Request**.
La Pull Request doit avoir deux approbations pour être appliquée sur la branche develop.
Les branches sont supprimées lorsque la pull request est acceptée.

Le nom des commits sont en anglais.

### Sécurité
Tous les commits sont vérifiés par le biais de clés GPG.

Les branches main et develop sont protégés par des règles ...

## Contribuer
La documentation de l’exécution de votre application via l’environnement de développement sous docker-compose

## Déploiement
La documentation de l’exécution de votre application en production avec Docker

## Tests logiciels
La documentation permettant aux autres développeurs de lancer les tests logiciels

## License
[MIT](https://choosealicense.com/licenses/mit/)

---
# Auto-generated Readme

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


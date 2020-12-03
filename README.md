[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)


# Voting System on Ethereum

This project is a training challenge: Propose a voting system on the Ethereum blockchain.


## prerequisite

you need to install the following components:
command line is for debian system :)

* [node.js](https://nodejs.org/en/) - evented I/O for the backend and npm management package.
```sh
sudo apt-get install nodejs npm
```
* [ganache](https://www.trufflesuite.com/ganache) - a personal Ethereum blockchain for test.
```sh
sorry you must download app !
```
* [angular](https://angular.io/) - frontend js framework.
```sh
$ sudo install -g @angular/cli@8.3 @angular/core@8.3
```

- [metamask](https://metamask.io/download.html) - wallet ethereum.

## Installation for dev environnement

* Start ganache with port 7545 and network id 5777
* Notice owner address in src/environments/environnements.ts file, owner is the first address account of ganache.
* Install dependency
```sh
npm install
```
* Compile and deploy contracts

```sh
$ truffle migrate --reset
```
* start debug server with angular
```sh
$ ng serve
```
* Open your browser at [http://localhost:4200](http://localhost:4200)

## manual 
[PDF Manual](https://github.com/thierryTrolle/alyra_defi_vote/blob/master/manual/manual.pdf)

## License
[MIT](https://choosealicense.com/licenses/mit/)

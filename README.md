# ILP Survey

## Todo
- [ ] proper storage layer
- [ ] improve efficiency
- [ ] user handling
- [ ] prevent user from getting paid multiple times

## Introduction

This repository contains a PoC for one possible application of the [Interledger Protocol](https://interledger.org/). Researchers often face the challenge of a too little participation rates in their surveys. ILP survey pays participants for each answer they give on a survey. It incentivizes them to complete the whole survey because the payment is only triggered when they finish, sending the collected credit to their payment pointer. 

## Setup

This application uses [redis](https://redis.io/) as storage layer (which is not ideal but ok for a PoC). The easiest way to run a redis instance is by using docker.

    $ docker run -d --name surveys -p 6379:6379 redis

In order to process payments, [moneyd](https://github.com/interledgerjs/moneyd) must be running. Please check its [Quick Start](https://github.com/interledgerjs/moneyd#quick-start) section for detailed installation instructions. If you want to test the application locally or using the ILP testnet, you must also run an [SPSP Server](https://github.com/interledgerjs/ilp-spsp-server) and create a payment pointer. All necessary information can be found [here](https://github.com/interledgerjs/ilp-spsp-server#ilp-spsp-server).

Clone the repository and install the necessary packages. Afterwards, start the application.

    $ npm install
    $ npm run start

The application can be reached at http://localhost:3000.
[![Build Status](https://travis-ci.com/Dominik-Hillmann/wiki-maps.svg?branch=main)](https://travis-ci.com/Dominik-Hillmann/wiki-maps)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/Dominik-Hillmann/wiki-maps.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/Dominik-Hillmann/wiki-maps/context:javascript)
[![CodeFactor](https://www.codefactor.io/repository/github/dominik-hillmann/wiki-maps/badge)](https://www.codefactor.io/repository/github/dominik-hillmann/wiki-maps)
[![Last commit](https://img.shields.io/github/last-commit/Dominik-Hillmann/wiki-maps)](https://img.shields.io/github/last-commit/Dominik-Hillmann/wiki-maps)
[![repo size](https://img.shields.io/github/repo-size/Dominik-Hillmann/wiki-maps)](https://img.shields.io/github/repo-size/Dominik-Hillmann/wiki-maps)
[![contains](https://img.shields.io/badge/contains-tasty%20spaghetti%20code-informational)](https://img.shields.io/badge/contains-tasty%20spaghetti%20code-informational)

# wiki-maps
A micro service that creates images with a word definition and a beautiful background image.

## Usage
```sh
docker start <container-name>
```
and 
```sh
docker stop <container-name>
```
Coming soon: documentation of the web API.

## Deployment
Image creation: go into this project's root and type
```sh
docker build -t wiki-maps .
```
Then, create the container using
```sh
docker run -t -d -p 80:5000 --name wiki-maps-container
```
mapping from port 80 of the host machine to port 5000 of the container.

## Configuration file `config.json`
# COMP 4521 Warzone Radar Backend

This is the documentation for backend for Android APP Warzone Radar for course PA at HKUST COMP 4521.


## Dependency

Node.JS:            v14.17.6

MySQL:           Ver 8.0.27 for Win64 on x86_64 (MySQL Community Server - GPL)

## Getting Started

To have the configs for database and password, please go to the directory of [config](./app/config), and do the following:

1. copy business.config.js from [template.business.config.js](./app/config/template.business.config.js)
2. configure domain in business.config.js
3. copy db.config.js from [template.db.config.js](./app/config/template.db.config.js)
4. configure database setting


5. To install the server
    ```{powershell}
    npm install
    ```
6. To compile the swgger file
    ```{powershell}
    node swagger.js
    ```

7. To run the server
    ```{powershell}
    node start.js
    ```

8. To visit the web for Swagger Documentation, ask for host's ip address, and use http://<-host-ip->:8090/api-docs/ to visit.

## Backend Database Schema

This backend use MySQL database. Schemas are at [here](./archive/warzone_schema.sql).

## Swagger Documentation

You can visit the automatically generated swagger documentation at [here](./swagger-output.json), or once the server is launched, visit the domain:port/api-doc. 

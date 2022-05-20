# COMP 4521 Warzone Radar Backend

This is the backend for Android APP Warzone Radar for course PA at HKUST COMP 4521.

## Getting Started

To have the configs for database and password, ask author for files in ./app/config and ./app/crypto.

To install the app
```{bash}
./init.sh
```

To visit the web for Swagger Documentation, ask for host's ip address, and use http://<-host-ip->:8090/api-docs/ to visit.

## Backend Database Schema

This backend use MySQL database. Schemas are at [here](./archive/warzone_schema.sql).

## Swagger Documentation

You can visit the automatically generated swagger documentation at [here](./swagger-output.json), or once the server is launched, visit the [<domain>:<port>/api-doc]. 

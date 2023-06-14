#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE movies_database;
EOSQL

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "movies_database" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE movies(movies_id uuid DEFAULT uuid_generate_v4(), name VARCHAR(30), genre VARCHAR(10), director VARCHAR(20));
EOSQL
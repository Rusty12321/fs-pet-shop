DROP TABLE IF EXISTS pet CASCADE;

CREATE TABLE pet (
    id serial primary key,
    age integer,
    kind varchar,
    name varchar
);
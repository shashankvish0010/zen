CREATE DATABASE zen;

CREATE TABLE Users(
    id VARCHAR PRIMARY KEY,
    firstname VARCHAR,
    lastname VARCHAR,
    email VARCHAR,
    user_password VARCHAR,
    zen_no VARCHAR,
    account_verified BOOLEAN,
    active BOOLEAN,
    zen_list JSON[]
)

CREATE TABLE Livestream(
    id VARCHAR PRIMARY KEY,
    title VARCHAR,
    streamer VARCHAR,
    producer_id VARCHAR
)


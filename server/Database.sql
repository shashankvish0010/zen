CREATE DATABASE zen;

CREATE TABLE Users(
    id VARCHAR PRIMARY KEY,
    firstname VARCHAR,
    lastname VARCHAR,
    email VARCHAR,
    user_password VARCHAR,
    zen_no VARCHAR,
    account_verified BOOLEAN
)


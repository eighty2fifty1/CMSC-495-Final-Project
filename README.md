also needed to use:
download mysql
be sure login info matches what is shown in app.py
create database using these commands in mySQL command line tools:

CREATE DATABASE chat_db;

USE chat_db;

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message TEXT
);

I'm currently getting a error 400 when I try to connect the client to the server. needs further troubleshooting

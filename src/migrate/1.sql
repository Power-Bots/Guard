CREATE TABLE IF NOT EXISTS bans (
    userID INTEGER NOT NULL,
    serverID INTEGER NOT NULL,
    unbanTime INTEGER
);

CREATE TABLE timers (
    userID INTEGER,
    serverID INTEGER NOT NULL,
    finishTime INTEGER,
    channelID INTEGER,
    type TEXT
);

INSERT INTO timers (userID, serverID, finishTime)
SELECT userID, serverID, unbanTime FROM bans;

UPDATE timers SET type = 'ban' WHERE type IS NULL;

DROP TABLE bans;
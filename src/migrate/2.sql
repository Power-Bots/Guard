CREATE TABLE timers_new (
    userID TEXT,
    serverID TEXT NOT NULL,
    finishTime INTEGER,
    channelID TEXT,
    type TEXT
);

INSERT INTO timers_new (userID, serverID, finishTime, channelID, type)
SELECT userID, serverID, finishTime, channelID, type FROM timers;

DROP TABLE timers;
ALTER TABLE timers_new RENAME TO timers;
CREATE TABLE config (
    scope TEXT NOT NULL,
    id TEXT NOT NULL,
    key TEXT NOT NULL,
    value TEXT,
    UNIQUE(id, key, scope)
);
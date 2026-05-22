CREATE TABLE tasknote.tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES tasknote.users(id),
    UNIQUE (name, user_id)
);

CREATE TABLE tasknote.task_tags (
    task_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (task_id, tag_id),
    FOREIGN KEY (task_id) REFERENCES tasknote.tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tasknote.tags(id) ON DELETE CASCADE
);

CREATE TABLE tasknote.note_tags (
    note_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES tasknote.notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tasknote.tags(id) ON DELETE CASCADE
);

-- Migrate existing tags for tasks
INSERT INTO tasknote.tags (name, user_id)
SELECT DISTINCT tag, user_id
FROM tasknote.tasks
WHERE tag IS NOT NULL AND tag <> '';

INSERT INTO tasknote.task_tags (task_id, tag_id)
SELECT t.id, tg.id
FROM tasknote.tasks t
JOIN tasknote.tags tg ON t.tag = tg.name AND t.user_id = tg.user_id
WHERE t.tag IS NOT NULL AND t.tag <> '';

-- Migrate existing tags for notes
INSERT INTO tasknote.tags (name, user_id)
SELECT DISTINCT tag, user_id
FROM tasknote.notes
WHERE tag IS NOT NULL AND tag <> ''
ON CONFLICT (name, user_id) DO NOTHING;

INSERT INTO tasknote.note_tags (note_id, tag_id)
SELECT n.id, tg.id
FROM tasknote.notes n
JOIN tasknote.tags tg ON n.tag = tg.name AND n.user_id = tg.user_id
WHERE n.tag IS NOT NULL AND n.tag <> '';

-- We keep the 'tag' column for now to avoid breaking the current code,
-- but we will remove it in a future migration or after updating the code.

-- Create a new tags table
CREATE TABLE tasknote.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create a junction table for tasks and tags
CREATE TABLE tasknote.task_tags (
    task_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY (task_id, tag_id),
    CONSTRAINT fk_task
        FOREIGN KEY (task_id)
        REFERENCES tasknote.tasks (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tag_task
        FOREIGN KEY (tag_id)
        REFERENCES tasknote.tags (id)
        ON DELETE CASCADE
);

-- Create a junction table for notes and tags
CREATE TABLE tasknote.note_tags (
    note_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    CONSTRAINT fk_note
        FOREIGN KEY (note_id)
        REFERENCES tasknote.notes (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tag_note
        FOREIGN KEY (tag_id)
        REFERENCES tasknote.tags (id)
        ON DELETE CASCADE
);

-- Migrate existing single tags to the new many-to-many structure
INSERT INTO tasknote.tags (name)
SELECT DISTINCT tag FROM tasknote.tasks WHERE tag IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO tasknote.tags (name)
SELECT DISTINCT tag FROM tasknote.notes WHERE tag IS NOT NULL
ON CONFLICT (name) DO NOTHING;

INSERT INTO tasknote.task_tags (task_id, tag_id)
SELECT t.id, tg.id
FROM tasknote.tasks t
JOIN tasknote.tags tg ON t.tag = tg.name
WHERE t.tag IS NOT NULL;

INSERT INTO tasknote.note_tags (note_id, tag_id)
SELECT n.id, tg.id
FROM tasknote.notes n
JOIN tasknote.tags tg ON n.tag = tg.name
WHERE n.tag IS NOT NULL;

-- Remove the old 'tag' columns
ALTER TABLE tasknote.tasks
    DROP COLUMN tag;

ALTER TABLE tasknote.notes
    DROP COLUMN tag;
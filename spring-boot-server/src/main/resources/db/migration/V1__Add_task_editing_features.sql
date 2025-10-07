-- Add new fields to tasks table
ALTER TABLE tasks ADD COLUMN version INT NOT NULL DEFAULT 1;
ALTER TABLE tasks ADD COLUMN last_edited_by UUID;
ALTER TABLE tasks ADD COLUMN tags TEXT;
ALTER TABLE tasks ADD COLUMN custom_fields TEXT;

-- Create task_history table
CREATE TABLE task_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL,
    field_name VARCHAR(255) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by UUID NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Create indexes for task_history
CREATE INDEX idx_task_history_task_id ON task_history(task_id);
CREATE INDEX idx_task_history_changed_at ON task_history(changed_at);
CREATE INDEX idx_task_history_changed_by ON task_history(changed_by);

-- Add foreign key constraints if needed
-- ALTER TABLE task_history ADD CONSTRAINT fk_task_history_task_id 
--     FOREIGN KEY (task_id) REFERENCES tasks(id);
-- ALTER TABLE task_history ADD CONSTRAINT fk_task_history_changed_by 
--     FOREIGN KEY (changed_by) REFERENCES users(id);
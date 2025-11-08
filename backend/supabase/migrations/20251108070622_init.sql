-- Create assistants table
CREATE TABLE assistants (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    voice_id VARCHAR(255),
    enabled_tools TEXT[]
);


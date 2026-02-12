DO $$ BEGIN
    CREATE TYPE role_enum AS ENUM ('admin', 'member', 'guest');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE card_type_enum AS ENUM ('event', 'task');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority_enum AS ENUM ('P0', 'P1', 'P2', 'None');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE log_action_enum AS ENUM ('create', 'delete', 'update', 'assign_user', 'add_user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE log_entity_enum AS ENUM ('task', 'board', 'documentation', 'board_column', 'board_settings', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE event_type_enum AS ENUM ('meeting', 'event');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "UserInfo" (
    "id" BIGSERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "surname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(512) NULL
);

CREATE TABLE IF NOT EXISTS "UserConnection" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGINT NOT NULL REFERENCES "UserInfo"("id") ON DELETE CASCADE,
    "provider" VARCHAR(255) NOT NULL,
    "providerAccountId" VARCHAR(255) NOT NULL,
    "accessToken" TEXT NULL,
    "refreshToken" TEXT NULL,
    "expiresAt" TIMESTAMP WITH TIME ZONE NULL,
    "scope" TEXT NULL,
    "tokenType" VARCHAR(255) NULL
);
DO $$ BEGIN
    ALTER TABLE "UserConnection" ADD CONSTRAINT "uc_provider_account" UNIQUE ("provider", "providerAccountId");
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN duplicate_table THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "Board" (
    "id" BIGSERIAL PRIMARY KEY,
    "boardName" VARCHAR(255) NOT NULL,
    "description" TEXT NULL,
    "boardSettingsId" BIGINT NOT NULL UNIQUE,
    "documentationSectionId" BIGINT NOT NULL UNIQUE,
    "createdBy" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NULL
);

CREATE TABLE IF NOT EXISTS "BoardTemplate" (
    "id" BIGSERIAL PRIMARY KEY,
    "createdBy" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "templateName" VARCHAR(255) NOT NULL,
    "description" TEXT NULL,
    "templateData" JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS "BoardParticipant" (
    "id" BIGSERIAL PRIMARY KEY,
    "boardId" BIGINT NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
    "participantUserId" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "role" role_enum NOT NULL
);
DO $$ BEGIN
    ALTER TABLE "BoardParticipant" ADD CONSTRAINT "uc_board_user" UNIQUE ("boardId", "participantUserId");
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN duplicate_table THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "Documentation" (
    "id" BIGSERIAL PRIMARY KEY,
    "boardId" BIGINT NULL,
    "documentName" VARCHAR(255) NOT NULL,
    "content" TEXT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NULL,
    "createdBy" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "updatedBy" BIGINT NULL REFERENCES "UserInfo"("id")
);

CREATE TABLE IF NOT EXISTS "BoardSettings" (
    "id" BIGSERIAL PRIMARY KEY,
    "boardId" BIGINT NULL,
    "backgroundColor" VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS "boardColumn" (
    "id" BIGSERIAL PRIMARY KEY,
    "columnName" VARCHAR(255) NOT NULL,
    "description" TEXT NULL,
    "boardId" BIGINT NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
    "columnIndex" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "EventMeeting" (
    "id" BIGSERIAL PRIMARY KEY,
    "eventName" VARCHAR(255) NOT NULL,
    "eventIndex" BIGINT NOT NULL,
    "boardColumnId" BIGINT NOT NULL REFERENCES "boardColumn"("id"),
    "description" TEXT NULL,
    "startingDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endingDate" TIMESTAMP WITH TIME ZONE NULL,
    "duration" VARCHAR(255) NULL,
    "integration" TEXT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NULL,
    "createdBy" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "updatedBy" BIGINT NULL REFERENCES "UserInfo"("id"),
    "type" event_type_enum NOT NULL DEFAULT 'event',
    "resume" TEXT NULL,
    "location" TEXT NULL
);

CREATE TABLE IF NOT EXISTS "Task" (
    "id" BIGSERIAL PRIMARY KEY,
    "taskName" VARCHAR(255) NOT NULL,
    "taskIndex" BIGINT NOT NULL,
    "boardColumnId" BIGINT NOT NULL REFERENCES "boardColumn"("id"),
    "description" TEXT NULL,
    "startingDate" TIMESTAMP WITH TIME ZONE NOT NULL,
    "endingDate" TIMESTAMP WITH TIME ZONE NULL,
    "duration" BIGINT NULL,
    "integrations" TEXT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NULL,
    "createdBy" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "updatedBy" BIGINT NULL REFERENCES "UserInfo"("id"),
    "priority" priority_enum NOT NULL DEFAULT 'None',
    "comment" JSONB NULL,
    "stepsChecklist" JSONB NULL
);

CREATE TABLE IF NOT EXISTS "eventPresence" (
    "id" BIGSERIAL PRIMARY KEY,
    "eventId" BIGINT NOT NULL REFERENCES "EventMeeting"("id") ON DELETE CASCADE,
    "userId" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "status" VARCHAR(50) NOT NULL
);

DO $$ BEGIN
    ALTER TABLE "eventPresence" ADD CONSTRAINT "uc_event_user_presence" UNIQUE ("eventId", "userId");
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN duplicate_table THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "assignee" (
    "id" BIGSERIAL PRIMARY KEY,
    "userId" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "cardId" BIGINT NOT NULL,
    "cardType" card_type_enum NOT NULL
);

CREATE TABLE IF NOT EXISTS "tags" (
    "id" BIGSERIAL PRIMARY KEY,
    "boardId" BIGINT NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
    "name" VARCHAR(255) NOT NULL,
    "color" VARCHAR(255) NOT NULL
);
DO $$ BEGIN
    ALTER TABLE "tags" ADD CONSTRAINT "uc_tag_board_name" UNIQUE ("boardId", "name");
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN duplicate_table THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "cardTag" (
    "id" BIGSERIAL PRIMARY KEY,
    "cardId" BIGINT NOT NULL,
    "tagId" BIGINT NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
    "cardType" card_type_enum NOT NULL
);
DO $$ BEGIN
    ALTER TABLE "cardTag" ADD CONSTRAINT "uc_card_tag_type" UNIQUE ("cardId", "tagId", "cardType");
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN duplicate_table THEN null;
END $$;

CREATE TABLE IF NOT EXISTS "ActivityLogs" (
    "id" BIGSERIAL PRIMARY KEY,
    "logName" VARCHAR(255) NOT NULL,
    "userId" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "boardId" BIGINT NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
    "entityType" log_entity_enum NOT NULL,
    "entityId" BIGINT NOT NULL,
    "action" log_action_enum NOT NULL,
    "detail" JSONB NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$ BEGIN
    ALTER TABLE "Board" ADD CONSTRAINT "fk_board_settings" FOREIGN KEY ("boardSettingsId") REFERENCES "BoardSettings"("id") ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object OR duplicate_table THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "BoardSettings" ADD CONSTRAINT "fk_boardsettings_board" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object OR duplicate_table THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "Documentation" ADD CONSTRAINT "fk_documentation_board" FOREIGN KEY ("boardId") REFERENCES "Board"("id") ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object OR duplicate_table THEN null;
END $$;

CREATE OR REPLACE FUNCTION create_default_board_content()
RETURNS TRIGGER AS $$
DECLARE
    col1_id BIGINT;
BEGIN
    INSERT INTO "boardColumn" ("boardId", "columnName", "columnIndex")
    VALUES (NEW.id, 'TODO', 0) RETURNING id INTO col1_id;

    INSERT INTO "boardColumn" ("boardId", "columnName", "columnIndex")
    VALUES (NEW.id, 'ON PROGRESS', 1);

    INSERT INTO "boardColumn" ("boardId", "columnName", "columnIndex")
    VALUES (NEW.id, 'DONE', 2);

    INSERT INTO "Task" ("taskName", "taskIndex", "boardColumnId", "description", "startingDate", "createdBy", "priority")
    VALUES ('First task', 0, col1_id, 'This is an example', CURRENT_TIMESTAMP, NEW."createdBy", 'None');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_default_board_content ON "Board";
CREATE TRIGGER trigger_create_default_board_content
AFTER INSERT ON "Board"
FOR EACH ROW EXECUTE FUNCTION create_default_board_content();

DO $$ BEGIN
    ALTER TABLE "Board" ADD CONSTRAINT "fk_board_documentation" FOREIGN KEY ("documentationSectionId") REFERENCES "Documentation"("id") ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_object OR duplicate_table THEN null;
END $$;

CREATE OR REPLACE FUNCTION get_board_details(p_board_id BIGINT)
RETURNS json AS $$
BEGIN
    RETURN (SELECT row_to_json(res) FROM (
        SELECT
            b.*,
            COALESCE(
                (
                    SELECT json_agg(bc_agg ORDER BY bc_agg."columnIndex")
                    FROM (
                        SELECT
                            bc.*,
                            COALESCE(
                                (SELECT json_agg(t.* ORDER BY t."taskIndex") FROM "Task" t WHERE t."boardColumnId" = bc.id),
                                '[]'::json
                            ) AS tasks,
                            COALESCE(
                                (SELECT json_agg(em.* ORDER BY em."eventIndex") FROM "EventMeeting" em WHERE em."boardColumnId" = bc.id),
                                '[]'::json
                            ) AS events
                        FROM "boardColumn" AS bc
                        WHERE bc."boardId" = b.id
                    ) AS bc_agg
                ),
                '[]'::json
            ) AS columns
        FROM "Board" AS b
        WHERE b.id = p_board_id
    ) res);
END;
$$ LANGUAGE plpgsql;

CREATE TYPE role_enum AS ENUM ('admin', 'member', 'guest') ON CONFLICT DO UPDATE;

CREATE TYPE card_type_enum AS ENUM ('event', 'task') ON CONFLICT DO UPDATE;

CREATE TYPE priority_enum AS ENUM ('P0', 'P1', 'P2', 'None') ON CONFLICT DO UPDATE;

CREATE TYPE log_action_enum AS ENUM ('create', 'delete', 'update', 'assign_user', 'add_user') ON CONFLICT DO UPDATE;

CREATE TYPE log_entity_enum AS ENUM ('task', 'board', 'documentation', 'board_column', 'board_settings', 'user') ON CONFLICT DO UPDATE;

CREATE TYPE event_type_enum AS ENUM ('meeting', 'event') ON CONFLICT DO UPDATE;

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
ALTER TABLE "UserConnection" ADD CONSTRAINT "uc_provider_account" UNIQUE ("provider", "providerAccountId");

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
ALTER TABLE "BoardParticipant" ADD CONSTRAINT "uc_board_user" UNIQUE ("boardId", "participantUserId");

CREATE TABLE IF NOT EXISTS "Documentation" (
    "id" BIGSERIAL PRIMARY KEY,
    "boardId" BIGINT NOT NULL REFERENCES "Board"("id") ON DELETE CASCADE,
    "documentName" VARCHAR(255) NOT NULL,
    "content" TEXT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE NULL,
    "createdBy" BIGINT NOT NULL REFERENCES "UserInfo"("id"),
    "updatedBy" BIGINT NULL REFERENCES "UserInfo"("id")
);

CREATE TABLE IF NOT EXISTS "BoardSettings" (
    "id" BIGSERIAL PRIMARY KEY,
    "boardId" BIGINT NOT NULL UNIQUE REFERENCES "Board"("id") ON DELETE CASCADE,
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

ALTER TABLE "eventPresence" ADD CONSTRAINT "uc_event_user_presence" UNIQUE ("eventId", "userId");

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
ALTER TABLE "tags" ADD CONSTRAINT "uc_tag_board_name" UNIQUE ("boardId", "name");

CREATE TABLE IF NOT EXISTS "cardTag" (
    "id" BIGSERIAL PRIMARY KEY,
    "cardId" BIGINT NOT NULL,
    "tagId" BIGINT NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
    "cardType" card_type_enum NOT NULL
);
ALTER TABLE "cardTag" ADD CONSTRAINT "uc_card_tag_type" UNIQUE ("cardId", "tagId", "cardType");

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


ALTER TABLE "Board" ADD CONSTRAINT "fk_board_settings" FOREIGN KEY ("boardSettingsId") REFERENCES "BoardSettings"("id") ON DELETE CASCADE;
ALTER TABLE "Board" ADD CONSTRAINT "fk_board_documentation" FOREIGN KEY ("documentationSectionId") REFERENCES "Documentation"("id") ON DELETE CASCADE;
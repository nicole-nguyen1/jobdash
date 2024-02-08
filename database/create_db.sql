CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "users" (
  "id" uuid DEFAULT uuid_generate_v4 (),
  "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "firstname" varchar NOT NULL,
  "lastname" varchar NOT NULL,
  "email" varchar NOT NULL UNIQUE,
  "password" BYTEA NOT NULL,
  CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "jobs" (
	"id" uuid DEFAULT uuid_generate_v4 (),
	"user_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"company_name" varchar NOT NULL,
	"curr_status" varchar NOT NULL,
	"url" varchar,
	"salary" varchar,
	"location" varchar,
	"working_model" varchar,
	"description" text,
	"company_color" varchar NOT NULL,
	"card_color" varchar,
	"timeline_id" uuid NOT NULL,
	CONSTRAINT "jobs_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "timeline_events" (
	"id" uuid DEFAULT uuid_generate_v4 (),
	"timeline_id" uuid NOT NULL,
	"date" date NOT NULL,
	"status" varchar NOT NULL,
	"substatus" varchar,
	CONSTRAINT "timeline_events_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "timelines" (
	"id" uuid DEFAULT uuid_generate_v4 (),
	"user_id" uuid NOT NULL,
	CONSTRAINT "timelines_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "jobs" ADD CONSTRAINT "jobs_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_fk1" FOREIGN KEY ("timeline_id") REFERENCES "timelines"("id");

ALTER TABLE "timeline_events" ADD CONSTRAINT "timeline_events_fk0" FOREIGN KEY ("timeline_id") REFERENCES "timelines"("id");

ALTER TABLE "timelines" ADD CONSTRAINT "timelines_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

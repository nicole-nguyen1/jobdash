DROP TABLE IF EXISTS users;

CREATE TABLE "users" (
	"id" varchar NOT NULL UNIQUE,
	"timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"firstname" varchar NOT NULL,
	"lastname" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" CHAR(128) NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);
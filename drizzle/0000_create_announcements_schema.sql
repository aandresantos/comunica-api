CREATE TYPE "public"."channel_type" AS ENUM('email', 'slack', 'teams');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'sent');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"channel_type" "channel_type" NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"author" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);

import { pgTable, serial, text, varchar, uuid, numeric, timestamp } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDesc: varchar('jobDesc').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt').notNull(),
    mockId: varchar('mockId').notNull()
});

export const UserAnswer = pgTable('UserAnswer', {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockId').notNull(),
    question: varchar('question').notNull(),
    correctAns: text('correctAns').notNull(),
    userAns: text('userAns').notNull(),
    feedback: text('feedback').notNull(),
    rating: varchar('rating').notNull(),
    userEmail: varchar('userEmail').notNull(),
    createdAt: varchar('createdAt').notNull()
});

export const Emotions = pgTable("emotions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("user_id").notNull(), // Clerk user ID
    mockIdRef: varchar("mockIdRef").notNull(), // Unique ID for the interview session
    emotion: varchar("emotion").notNull(), // Emotion type (e.g., "happy", "sad")
    percentage: numeric("percentage").notNull(), // Emotion percentage (e.g., 0.85 for 85%)
    timestamp: timestamp("timestamp").defaultNow(), // Timestamp of the emotion detection
});

export const EmotionFeedback = pgTable("emotionfeedback", {
    id: uuid("id").defaultRandom().primaryKey(), // Clerk user ID
    mockIdRef: varchar("mockIdRef").notNull(), // Unique ID for the interview session
    emotionFeedback: text("emotionFeedback").notNull(), // Emotion type (e.g., "happy", "sad")
    timestamp: timestamp("timestamp").defaultNow(), // Timestamp of the emotion detection
});
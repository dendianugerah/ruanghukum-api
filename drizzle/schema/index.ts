import {
  pgTable,
  varchar,
  pgEnum,
  time,
  uuid,
  numeric,
  boolean,
  date,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female"]);

const timestampColumns = () => ({
  createdAt: time("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: time("updated_at", { withTimezone: true }).defaultNow(),
  deletedAt: time("deleted_at", { withTimezone: true }),
});

export const professional = pgTable("professional", {
  id: uuid("id").primaryKey(),
  about: varchar("about", { length: 255 }),
  experience: varchar("experience", { length: 255 }),
  chatConsultationFee: numeric("chat_consultation_fee", {
    precision: 10,
    scale: 2,
  }),
  videoConsultationFee: numeric("video_consultation_fee", {
    precision: 10,
    scale: 2,
  }),
  ...timestampColumns(),
});

export const user = pgTable("user", {
  id: uuid("id").primaryKey(),
  professionalId: uuid("professional_id").references(() => professional.id),
  fullname: varchar("fullname", { length: 255 }),
  email: varchar("email", { length: 255 }),
  password: varchar("password", { length: 255 }),
  address: varchar("address", { length: 255 }),
  phoneNumber: varchar("phone_number", { length: 100 }),
  gender: genderEnum("gender"),
  jobTitle: varchar("job_title", { length: 255 }),
  idCardNumber: varchar("id_card_number", { length: 100 }),
  birthDate: date("birth_date"),
  ...timestampColumns(),
});

export const expertise = pgTable("expertise", {
  id: uuid("id").primaryKey(),
  name: varchar("name", { length: 255 }),
});

export const professional_expertise = pgTable("professional_expertise", {
  id: uuid("id").primaryKey(),
  professionalId: uuid("professional_id").references(() => professional.id),
  expertiseId: uuid("expertise_id").references(() => expertise.id),
  ...timestampColumns(),
});

export const rating = pgTable("rating", {
  id: uuid("id").primaryKey(),
  professionalId: uuid("professional_id").references(() => professional.id),
  userId: uuid("user_id").references(() => user.id),
  rating: numeric("rating", { precision: 10, scale: 2 }),
  ...timestampColumns(),
});

export const chat_room = pgTable("chat_room", {
  id: uuid("id").primaryKey(),
  professionalId: uuid("professional_id").references(() => professional.id),
  userId: uuid("user_id").references(() => user.id),
  isActived: boolean("is_actived").default(false),
});

export const chat_room_message = pgTable("chat_room_message", {
  id: uuid("id").primaryKey(),
  chatRoomId: uuid("chat_room_id").references(() => chat_room.id),
  userId: uuid("user_id").references(() => user.id),
  message: varchar("message", { length: 255 }),
});

export const blog = pgTable("blog", {
  id: uuid("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  content: varchar("content", { length: 255 }),
  image: varchar("image", { length: 255 }),
  flag: varchar("flag", { length: 255 }),
  ...timestampColumns(),
});

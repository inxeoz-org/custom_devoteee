import { z } from "zod";

/* -------------------------------------------
   Companion Schema + Type
-------------------------------------------- */
export const CompanionSchema = z.object({
  companion_name: z.string().min(1),
  gender: z.string(),
  age: z.number().int().min(0),
  phone: z
    .string()
    .nullable()
    .transform((v) => (v ? v.replace(/\D/g, "") : null)),
});

export type Companion = z.infer<typeof CompanionSchema>;

/* -------------------------------------------
   Devoteee Profile Schema + Type
-------------------------------------------- */

export const DevoteeeProfile = z.object({
  devoteee_name: z.string().min(1),
  gender: z.string(),

  dob: z.string().transform((val) => {
    const d = new Date(val);
    if (isNaN(d.getTime())) throw new Error("Invalid DOB");
    return d.toISOString().split("T")[0];
  }),
  aadhar: z.string().nullable(),
  location: z.string(),
  companion: z.array(CompanionSchema),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
});

export type DevoteeeProfile = z.infer<typeof DevoteeeProfile>;
/* -------------------------------------------
   Protocol Schema + Type
-------------------------------------------- */
export const ProtocolSchema = z.object({
  name: z.string(),
  protocol_name: z.string().min(1),
  description: z.string().min(1),
  protocol_level: z.number().int().min(1),
  fee: z.number().min(0),
});

export type Protocol = z.infer<typeof ProtocolSchema>;

/* -------------------------------------------
   VipDarshanSlot Schema + Type
-------------------------------------------- */
export const VipDarshanSlotSchema = z.object({
  slot_name: z.string(),
  current_capacity: z.number().int().min(0),
});

export type VipDarshanSlot = z.infer<typeof VipDarshanSlotSchema>;

export const AppointmenSchema = z.object({
  name: z.string().uuid(),
  slot_date: z.string().datetime(),
  slot: z.string(),
  protocol: z.string(),
  state: z.string(),
  group_size: z.number().int().min(1),
  workflow_state: z.string(),
  devoteee_name: z.string().min(1),
  escort_person: z.string().uuid().nullable(),
  companion: z.array(CompanionSchema),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

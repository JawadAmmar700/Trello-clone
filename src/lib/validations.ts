import { z } from "zod";

const Session = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    image: z.string().url(),
  }),
  expires: z.string(),
});

export type Z_Session = z.infer<typeof Session>;

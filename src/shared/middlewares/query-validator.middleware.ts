import { z } from "zod";

export function validateQuery(schema: z.ZodSchema) {
  return (req: any, _reply: any, done: any) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      done(new Error("Query inválida"));
    } else {
      req.query = result.data;
      done();
    }
  };
}

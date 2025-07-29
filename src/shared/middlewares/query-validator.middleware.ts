import { z as zod, ZodError } from "zod";

export function validateQuery(schema: zod.ZodSchema) {
  return (req: any, _: any, done: any) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      done(new ZodError(result.error.issues));
    }

    req.query = result.data;

    done();
  };
}

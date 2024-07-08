import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { query } from 'express';
import { z } from 'zod';

extendZodWithOpenApi(z);

export type Bible = z.infer<typeof BibleSchema>;
export const BibleSchema = z.object({
  book: z.string(),
  chapter: z.number(),
  verse: z.number()
});

export const GetBibleSchema = z.object({
  params: z.object({ book: z.string() }),
  query: z.object({ chapter: z.number().nullable(), verse: z.number().nullable() })
});

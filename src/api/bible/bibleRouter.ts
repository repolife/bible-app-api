import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import express, { Request, Response, Router } from 'express';
import { z } from 'zod';

import { createApiResponse } from '@/api-docs/openAPIResponseBuilders';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { handleServiceResponse, validateRequest } from '@/common/utils/httpHandlers';

import { BibleSchema, GetBibleSchema } from './bibleModel';
import { bibleService } from './bibleService';

export const bibleRegistry = new OpenAPIRegistry();

bibleRegistry.register('Bible', BibleSchema);

export const bibleRouter: Router = (() => {
  const router = express.Router();

  bibleRegistry.registerPath({
    method: 'get',
    path: '/bible',
    tags: ['Bible'],
    responses: createApiResponse(z.array(BibleSchema), 'Success'),
  });

  router.get('/', async (req: Request, res: Response) => {
    const serviceResponse = await bibleService.findAll();
    handleServiceResponse(serviceResponse, res);
  });
  bibleRegistry.registerPath({
    method: 'get',
    path: '/bible/{book}',
    description: "Get bible books wth chapter and verse",
    summary: "Get a single bible book",
    tags: ['Bible'],

    request: { params: GetBibleSchema.shape.params, query: GetBibleSchema.shape.query },
    responses: createApiResponse(BibleSchema, 'Success'),
  });

  router.get('/:book', validateRequest(GetBibleSchema), async (req: Request, res: Response) => {
    const book = req.params.book as string;
    const serviceResponse = await bibleService.filteredByBook(book);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

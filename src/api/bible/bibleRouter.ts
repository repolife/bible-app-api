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

  router.get('/', async (_req: Request, res: Response) => {
    const serviceResponse = await bibleService.findAll();
    handleServiceResponse(serviceResponse, res);
  });

  bibleRegistry.registerPath({
    method: 'get',
    path: '/bible/{book}',
    tags: ['Book'],
    request: { params: GetBibleSchema.shape.params },
    responses: createApiResponse(BibleSchema, 'Success'),
  });

  router.get('/:book', validateRequest(BibleSchema), async (req: Request, res: Response) => {
    const book = req.params.book;
    console.log(book);
    const serviceResponse = await bibleService.filteredByBook(book);
    handleServiceResponse(serviceResponse, res);
  });

  return router;
})();

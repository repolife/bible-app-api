import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

import { Bible } from './bibleModel';
import { bibleRepository } from './bibleRepository';

export const bibleService = {
  findAll: async (): Promise<ServiceResponse<Bible[] | null>> => {
    try {
      const bible = await bibleRepository.findAllAsync();
      console.log('damn');

      if (!bible) {
        return new ServiceResponse(ResponseStatus.Failed, 'No bible books found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Bible[]>(ResponseStatus.Success, 'Bible found', bible, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error finding all bible books: $${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },

  filteredByBook: async (book: string): Promise<ServiceResponse<Bible[] | null>> => {
    try {
      console.log('filtering');
      const bible = await bibleRepository.findByBookAsync(book);
      if (!bible) {
        return new ServiceResponse(ResponseStatus.Failed, 'Book not found', null, StatusCodes.NOT_FOUND);
      }
      return new ServiceResponse<Bible[]>(ResponseStatus.Success, 'Book found', bible, StatusCodes.OK);
    } catch (error) {
      const errorMessage = `Error finding bible book ${book}: , ${(error as Error).message}`;
      logger.error(errorMessage);
      return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },
};

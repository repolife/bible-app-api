import bible from '@/data/bible-books.json';

import { Bible } from './bibleModel';

export const bibleData: Bible[] = bible;

export const bibleRepository = {
  findAllAsync: async (): Promise<Bible[]> => {
    return bibleData;
  },

  findByBookAsync: async (book: string): Promise<Bible[] | null> => {
    return bibleData.filter(b => b.book === book)
  },
};

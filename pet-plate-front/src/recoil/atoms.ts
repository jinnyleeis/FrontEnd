import { atom } from 'recoil';
import { RawFood, ConsumedRaw } from '@lib/types';

export const isValidState = atom({
  key: 'isValidState',
  default: false,
});

export const isServing = atom({
  key: 'isServing',
  default: false,
});

export const searchQueryState = atom<string>({
  key: 'searchQueryState',
  default: '',
});


export const consumedRawsState = atom<ConsumedRaw[]>({
  key: 'consumedRawsState',
  default: [
    { petId: 1, rawId: '닭가슴살', serving: 100, date: '2023-07-01' },
    { petId: 1, rawId: '소고기', serving: 150, date: '2023-07-01' },
    { petId: 1, rawId: '연어', serving: 100, date: '2023-07-01' },
    { petId: 1, rawId: '고구마', serving: 100, date: '2023-07-02' },
    { petId: 2, rawId: '오리', serving: 200, date: '2023-07-02' },
    { petId: 2, rawId: '돼지고기', serving: 120, date: '2023-07-02' },
    { petId: 3, rawId: '양고기', serving: 180, date: '2023-07-03' },
    { petId: 3, rawId: '당근', serving: 110, date: '2023-07-03' },
  ],
});
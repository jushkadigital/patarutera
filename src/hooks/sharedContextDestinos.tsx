'use client';

import { createContext, useState, useContext, Dispatch, SetStateAction } from 'react';

const SharedStateContext = createContext<{ priceOne: [number,number]; setPriceOne: Dispatch<SetStateAction<[number,number]>>}>
({priceOne:[0,300],setPriceOne:(prev)=>prev});

export const SharedStateProvider = ({ children }) => {
  const [priceOne, setPriceOne] = useState<[number,number]>([0,1800]);

  return (
    <SharedStateContext.Provider value={{ priceOne, setPriceOne }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => useContext(SharedStateContext);

'use client';
import { createContext, useContext, useState } from 'react';

const ViewedContext = createContext(null);

export function ViewedProvider({ children }) {
  const [viewedIds, setViewedIds] = useState(new Set());

  const markViewed = (id) => setViewedIds(prev => new Set([...prev, id]));
  const markAllViewed = (ids) => setViewedIds(prev => new Set([...prev, ...ids]));
  const isViewed = (id) => viewedIds.has(id);

  return (
    <ViewedContext.Provider value={{ viewedIds, markViewed, markAllViewed, isViewed }}>
      {children}
    </ViewedContext.Provider>
  );
}

export const useViewed = () => useContext(ViewedContext);
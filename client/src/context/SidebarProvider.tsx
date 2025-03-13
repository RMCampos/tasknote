import React, { useMemo, useState } from 'react';
import SidebarContext, { SidebarContextData } from './SidebarContext';

interface Props {
  children: React.ReactNode;
}

const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }: Props) => {
  const [currentPage, setCurrentPage] = useState<string>('/home');

  const setNewPage = (page: string): void => {
    setCurrentPage(page);
  };

  const contextValue: SidebarContextData = useMemo(() => ({
    currentPage,
    setNewPage
  }), [currentPage, setNewPage]);

  return (
    <SidebarContext.Provider value={contextValue}>
      { children }
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;

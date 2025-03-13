import { createContext } from 'react';

export interface SidebarContextData {
  currentPage: string;
  setNewPage: (page: string) => void;
}

const SidebarContext = createContext<SidebarContextData>({} as SidebarContextData);

export default SidebarContext;

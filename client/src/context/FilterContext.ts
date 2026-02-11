import { createContext } from 'react';

export interface FilterContextData {
  filterText: string;
  selectedOption: string;
  setFilterText: (text: string) => void;
  setSelectedOption: (option: string) => void;
}

const FilterContext = createContext<FilterContextData>({} as FilterContextData);

export default FilterContext;

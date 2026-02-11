import React, { useEffect, useMemo, useState } from 'react';
import FilterContext, { FilterContextData } from './FilterContext';

const FILTER_TEXT_KEY = 'FILTER_TEXT';
const FILTER_OPTION_KEY = 'FILTER_OPTION';

interface Props {
  children: React.ReactNode;
}

const FilterProvider: React.FC<Props> = ({ children }: Props) => {
  const [filterText, setFilterTextState] = useState<string>(
    () => localStorage.getItem(FILTER_TEXT_KEY) ?? ''
  );
  const [selectedOption, setSelectedOptionState] = useState<string>(
    () => localStorage.getItem(FILTER_OPTION_KEY) ?? 'everything'
  );

  useEffect(() => {
    localStorage.setItem(FILTER_TEXT_KEY, filterText);
  }, [filterText]);

  useEffect(() => {
    localStorage.setItem(FILTER_OPTION_KEY, selectedOption);
  }, [selectedOption]);

  const setFilterText = (text: string): void => {
    setFilterTextState(text);
  };

  const setSelectedOption = (option: string): void => {
    setSelectedOptionState(option);
  };

  const contextValue: FilterContextData = useMemo(() => ({
    filterText,
    selectedOption,
    setFilterText,
    setSelectedOption
  }), [filterText, selectedOption]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;

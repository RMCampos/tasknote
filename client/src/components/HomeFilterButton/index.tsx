import React from 'react';

type Props = {
  text: string;
  onClick: () => void;
  type: string;
};

const HomeFilterButton: React.FC<Props> = (props: Props) => {
  const homeHigh = props.type === 'high' ? 'home-high' : '';
  const homeAll = props.type === 'all' ? 'home-all ms-2' : '';
  const homeTag = props.type === 'tag' ? 'home-tag ms-2' : '';
  const filterClasses = [homeHigh, homeAll, homeTag].join(' ');

  return (
    <button
      className={`home-filter ${filterClasses}`}
      type="button"
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default HomeFilterButton;

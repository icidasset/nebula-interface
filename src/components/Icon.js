import { createElement } from 'react';


const Icon = ({ icon, className = '' }) => {
  return (
    <svg className={[ 'icon' ].concat([ className ]).join(' ')}>
      <use xlinkHref={`/sprite.svg#${icon}`} />
    </svg>
  );
};


export default Icon;

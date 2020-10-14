import React from 'react';
import './Rating.css';

export default function Rating(props) {
  const stars = [0, 0, 0, 0, 0].map((_, i) =>
    (i < props.value)
      ? <span key={i}>&#9733; </span>
      : <span key={i}>&#9734; </span>
  );
  return (
    <div className="rating">
      {stars}
    </div>
  );
}

Rating.propTypes = {
  value: (props, propName, componentName) => {
    const prop = props[propName];
    if (!prop) {
      return new Error(`${propName} is required in ${componentName}. Validation failed.`);
    }
    if (typeof prop != 'string') {
      return new Error(`Invalid prop, ${propName} is expected to be a string in ${componentName}. ${typeof prop} found.`);
    }
    if (Number(prop) < 1 || Number(prop) > 5) {
      return new Error(`Invalid prop, ${propName} should be in range 1 - 5 in ${componentName}. ${prop} found.`);
    }
  }
};

Rating.defaultProps = {
  value: 1
};
import * as React from 'react';

import './styles.css';

interface Props {
  visible: boolean;
}

const LoadingSpinner: React.SFC<Props> = (props) => {

  return (
    <div className={props.visible ? 'spinnerWrapper' : 'hidden'}>
      <div className="spinner" />
    </div>
  );

};

export default LoadingSpinner;
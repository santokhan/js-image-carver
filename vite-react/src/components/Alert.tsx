import React from 'react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';

import Row from './Row';

type AlertType = 'error' | 'info';

type AlertProps = {
  type: AlertType,
  children: React.ReactNode | null,
};

type AlertIcons = Record<AlertType, React.ReactNode>;

type AlertClasses = Record<AlertType, string>;

export const InfoAlert: AlertType = 'info';
export const ErrorAlert: AlertType = 'error';

const alertIcons: AlertIcons = {
  [InfoAlert]: <BsFillInfoCircleFill size={18} />,
  [ErrorAlert]: <BiErrorCircle size={18} />,
};

const alertClasses: AlertClasses = {
  [InfoAlert]: 'text-blue-600 bg-blue-100',
  [ErrorAlert]: 'text-red-600 bg-red-100',
};

const Alert = (props: AlertProps): React.ReactElement | null => {
  const { children, type } = props;

  if (!children) {
    return null;
  }

  return (
    <div className={`py-3 px-4 rounded-md ${alertClasses[type]}`}>
      <Row>
        <div className="mr-3">
          {alertIcons[type]}
        </div>
        <div className="text-sm">
          {children}
        </div>
      </Row>
    </div>
  );
};

export default Alert;

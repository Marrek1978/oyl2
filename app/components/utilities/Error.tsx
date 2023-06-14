import { FaExclamationCircle } from 'react-icons/fa';
import type { FC } from 'react';

interface ErrorProps{
  title: string;
  children: React.ReactNode;
}


const Error:FC<ErrorProps> = ({ title, children }) => (
    <div className="error">
      <div className="icon">
        <FaExclamationCircle />
      </div>
      <h2>{title}</h2>
      {children}
    </div>
  );

export default Error;

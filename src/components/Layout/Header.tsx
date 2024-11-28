
import React from 'react';

// Define the props interface
interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
    </header>
  );
};

export default Header;

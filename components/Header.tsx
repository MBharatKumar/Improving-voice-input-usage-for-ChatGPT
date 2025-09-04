
import React from 'react';
import { MenuIcon, SparkleIcon, ChevronDownIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
      <button className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700">
        <MenuIcon className="w-6 h-6" />
      </button>
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">ChatGPT</h1>
        <ChevronDownIcon className="w-4 h-4 opacity-70" />
      </div>
      <button className="bg-zinc-700 dark:bg-zinc-600 hover:bg-zinc-600 dark:hover:bg-zinc-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
        <SparkleIcon className="w-5 h-5" />
        Upgrade
      </button>
    </header>
  );
};
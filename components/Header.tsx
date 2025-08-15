
import React from 'react';
import { PaintBrushIcon } from './Icon';

export const Header: React.FC = () => (
  <header className="text-center">
    <div className="flex items-center justify-center gap-4">
      <PaintBrushIcon className="w-10 h-10 text-indigo-400" />
      <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
        AI Wallpaper Craft
      </h1>
    </div>
    <p className="mt-4 text-lg text-gray-400">
      Craft your perfect wallpaper. Just describe your vision and let AI bring it to life.
    </p>
  </header>
);

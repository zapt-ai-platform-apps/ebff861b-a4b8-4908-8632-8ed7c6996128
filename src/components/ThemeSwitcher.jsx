import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleThemeChange = (e) => {
    toggleTheme(e.target.value);
  };

  return (
    <div className="mt-4">
      <label className="mr-2">Select Theme:</label>
      <select
        value={theme}
        onChange={handleThemeChange}
        className="px-2 py-1 border rounded box-border bg-bg-color text-text-color"
      >
        <option value="theme-light">Classic Light</option>
        <option value="theme-dark">Dark Mode</option>
      </select>
    </div>
  );
}
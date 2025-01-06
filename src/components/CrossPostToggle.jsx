import React, { useState, useEffect } from 'react';

export default function CrossPostToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/crosspost/status')
      .then((res) => res.json())
      .then((data) => setEnabled(data.enabled))
      .catch((error) => console.error('Status error:', error));
  }, []);

  const handleToggle = () => {
    fetch('/api/crosspost/toggle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled: !enabled }),
    })
      .then(() => setEnabled(!enabled))
      .catch((error) => console.error('Toggle error:', error));
  };

  return (
    <div className="my-2">
      <label className="flex items-center cursor-pointer">
        <div className="mr-2">Enable Cross-Posting</div>
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleToggle}
          className="cursor-pointer"
        />
      </label>
    </div>
  );
}
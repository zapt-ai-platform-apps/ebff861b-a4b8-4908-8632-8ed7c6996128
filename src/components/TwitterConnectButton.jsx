import React, { useState } from 'react';

export default function TwitterConnectButton() {
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    window.location.href = '/api/twitter/auth';
  };

  const handleDisconnect = () => {
    fetch('/api/twitter/disconnect')
      .then(() => setConnected(false))
      .catch((error) => console.error('Disconnect error:', error));
  };

  return (
    <div className="my-2">
      {!connected ? (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
          onClick={handleConnect}
        >
          Connect Twitter Account
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
          onClick={handleDisconnect}
        >
          Disconnect Twitter Account
        </button>
      )}
    </div>
  );
}
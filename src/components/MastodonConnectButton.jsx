import React, { useState } from 'react';

export default function MastodonConnectButton() {
  const [connected, setConnected] = useState(false);
  const [instanceUrl, setInstanceUrl] = useState('');

  const handleConnect = () => {
    if (!instanceUrl) {
      alert('Please enter your Mastodon instance URL.');
      return;
    }
    window.location.href = `/api/mastodon/auth?instance_url=${encodeURIComponent(
      instanceUrl
    )}`;
  };

  const handleDisconnect = () => {
    fetch('/api/mastodon/disconnect')
      .then(() => setConnected(false))
      .catch((error) => console.error('Disconnect error:', error));
  };

  return (
    <div className="my-2">
      {!connected ? (
        <div>
          <input
            type="text"
            placeholder="Mastodon Instance URL"
            value={instanceUrl}
            onChange={(e) => setInstanceUrl(e.target.value)}
            className="px-2 py-1 border rounded box-border"
          />
          <button
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded cursor-pointer"
            onClick={handleConnect}
          >
            Connect Mastodon Account
          </button>
        </div>
      ) : (
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
          onClick={handleDisconnect}
        >
          Disconnect Mastodon Account
        </button>
      )}
    </div>
  );
}
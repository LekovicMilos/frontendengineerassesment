'use client';

import React from 'react';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl">About</h1>
        <h2 className="mb-4 text-lg">Frontend Engineer Assessment built by Milos Lekovic</h2>
        <ul></ul>
        <li>Fetching external API https://api.oireachtas.ie/v1/legislation for retrieving bills</li>
        <li>Using Tailwind CSS for styling</li>
        <li>Using Material UI component library</li>
        <li>Using redux for state management (adding bills, managing favourites)</li>
        <li>Persisting state</li>
        <li>Listing bills in the table, marking bills as favourites</li>
        <li>Bill details dialog</li>
        <li>Responsive design</li>
        <li>Using Eslint and Prettier for code quality and consistency</li>
        <li>Using @heroicons/react for icons</li>
        <li>Pagination</li>
        <li>Filtering by type</li>
      </div>
    </main>
  );
}

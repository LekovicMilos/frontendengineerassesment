import React from 'react';
import { DataTable } from '@/components/organisms/table/data-table';
import { Suspense } from 'react';

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 lg:px-24">
      <div className="z-10 w-full max-w-5xl flex-col items-center justify-between font-mono text-sm lg:flex">
        <div className="w-full">
          <Suspense key={query + currentPage} fallback={<div>Loading...</div>}>
            <DataTable currentPage={currentPage} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

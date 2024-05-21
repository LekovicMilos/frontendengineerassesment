'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

type PaginationProps = {
  totalPages: number;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
};

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  handlePreviousPage,
  handleNextPage,
}) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <span>
        {' '}
        Page {currentPage} of {totalPages}{' '}
      </span>
      <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        >
        Next
      </Button>
    </div>
  )
};

export default Pagination;

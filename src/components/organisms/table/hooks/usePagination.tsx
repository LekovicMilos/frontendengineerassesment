import { useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export const usePagination = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const currentPageParam = Number(searchParams.get('page')) || 1;

  const [currentPage, setCurrentPage] = useState(currentPageParam || 1);

  const handlePageChange = (e: React.MouseEvent, newPage: number) => {
    replace(`${pathname}?page=${newPage + 1}`);
    setCurrentPage(() => Math.max(newPage, 1));
  };

  return { currentPage, setCurrentPage, handlePageChange };
};

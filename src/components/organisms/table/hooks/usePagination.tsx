import { useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export const usePagination = (total: number) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const currentPageParam = Number(searchParams.get('page')) || 1;

  const [currentPage, setCurrentPage] = useState(currentPageParam || 1);

  const handlePreviousPage = () => {
    replace(`${pathname}?page=${currentPageParam - 1}`);
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    replace(`${pathname}?page=${currentPageParam + 1}`);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, total));
  };

  return { currentPage, handlePreviousPage, handleNextPage };
};

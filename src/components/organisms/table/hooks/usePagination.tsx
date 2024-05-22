import { useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export const usePagination = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const currentPageParam = Number(searchParams.get('page')) || 1;
  const billStatusParam = searchParams.get('bill_status') || '';
  const billNumberParam = searchParams.get('bill_no') || '';

  const [currentPage, setCurrentPage] = useState(currentPageParam || 1);

  const handlePageChange = (e: React.MouseEvent, newPage: number) => {
    replace(
      `${pathname}?page=${newPage + 1}${billStatusParam ? `&bill_status=${billStatusParam}` : ''}${billNumberParam ? `&bill_no=${billNumberParam}` : ''}`,
    );
    setCurrentPage(() => Math.max(newPage, 1));
  };

  // useEffect(() => {
  //   replace(`${pathname}?page=${1}${billStatusParam ? `&bill_status=${billStatusParam}` : ''}${billNumberParam ? `&bill_no=${billNumberParam}` : ''}`);
  //   setCurrentPage(() => Math.max(1, 1));
  // }, [searchValue, billStatusParam, billNumberParam, pathname, replace]);

  return { currentPage, setCurrentPage, handlePageChange };
};

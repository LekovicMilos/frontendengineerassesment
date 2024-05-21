import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addBills } from '@/redux/slices/legislationSlice';
import { usePagination } from '@/components/organisms/table/hooks/usePagination';
import { ReduxState } from '../data-table';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useBills(currentPage: number, searchValue: string) {
  const dispatch = useDispatch();
  const billsSelector = useSelector((state: ReduxState) => state.legislation.bills);
  const totalSelector = useSelector((state: ReduxState) => state.legislation.total);

  useEffect(() => {
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const fetchData = async function getBills() {
      try {
        const response = await fetch(
          `${apiBaseUrl}/api/legislation?limit=${limit}&skip=${skip}${searchValue ? `&type=${searchValue}` : ''}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        dispatch(addBills(responseData));
        return responseData;
      } catch (error) {
        console.error('Error fetching bills in Home:', error);
        return [];
      }
    };

    fetchData();
  }, [dispatch, currentPage, searchValue]);

  const { handlePageChange } = usePagination();

  return { bills: billsSelector, total: totalSelector, handlePageChange };
}

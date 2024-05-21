'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlinedIcon } from '@heroicons/react/24/outline';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import TableHeader from '@/components/organisms/table/table-header';
import DetailsDialog from '@/components/organisms/dialog/details-dialog';
// import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useSelector, useDispatch } from 'react-redux';
import { addBills, addFavourite, removeFavourite } from '@/redux/slices/legislationSlice';
import Pagination from '@/components/organisms/table/pagination';
import { usePagination } from '@/components/organisms/table/hooks/usePagination';
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export type Bill = {
  type: string;
  number: string;
  status: string;
  sponsor: string;
  longTitleEn: string;
  longTitleGa: string;
  uri: string;

};

export type Data = {
  bills: Bill[];
  total: number;
};

export type ReduxState = {
  legislation: {
    bills: Bill[];
    total: number;
    favourites: Bill[];
  }
};

export function DataTable({ currentPage }: { currentPage: number}) {
  const dispatch = useDispatch();
  const billsSelector = useSelector((state: ReduxState) => state.legislation.bills);
  const totalSelector = useSelector((state: ReduxState) => state.legislation.total);
  const favouritesSelector = useSelector((state: ReduxState) => state.legislation.favourites);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isDetailsModalOpen, setIsDetaisModalOpen] = useState(false);

  const handleDelete = (e: MouseEvent, bill: Bill) => {
    e.preventDefault();
    e.stopPropagation();
    const isFavourite = favouritesSelector.some(fav => fav.uri === bill.uri);
    dispatch(isFavourite ? removeFavourite(bill) : addFavourite(bill));
  };

  const columns: ColumnDef<Bill>[] = [
    {
      accessorKey: 'number',
      header: "Bill number",
      cell: ({ row }) => <div>{row.getValue('number')}</div>,
    },
    {
      accessorKey: 'type',
      header: 'Bill type',
      cell: ({ row }) => <div>{row.getValue('type')}</div>,
    },
    {
      accessorKey: 'status',
      header: 'Bill status',
      cell: ({ row }) => <div>{row.getValue('status')}</div>,
    },
    {
      accessorKey: 'sponsor',
      header: 'Bill sponsor',
      cell: ({ row }) => <div>{row.getValue('sponsor')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const isFavourite = favouritesSelector.some(fav => fav.uri === row.original.uri);
        return (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            data-testid="delete-button"
            onClick={(e) => handleDelete(e, row.original)}
          >
            {isFavourite ? <StarIcon className="h-4 w-4" /> : <StarOutlinedIcon className="h-4 w-4" />}
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    const limit = 10;
    const skip = (currentPage - 1) * limit;
    const fetchData = async function getBills() {
      try {
        const response = await fetch(`${apiBaseUrl}/api/legislation?limit=${limit}&skip=${skip}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
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
    }
  
    fetchData();
  }, [dispatch, currentPage]);

  const table = useReactTable({
    data: billsSelector,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const filteredData = table.getSortedRowModel().rows;

  const { handlePreviousPage, handleNextPage } =
    usePagination(totalSelector);

  const handleDetailsOpen = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDetaisModalOpen(true);
  };

  return (
    <div className="w-full">
      <h1 className="text-4xl my-4">Dashboard</h1>
      {/* <div className="flex items-center py-4">
        <Input
          placeholder="Filter bills..."
          value={(table.getColumn('type')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            const filterValue = event.target.value;
            table.getColumn('type')?.setFilterValue(filterValue);
          }}
          className="max-w-48 lg:max-w-xs"
        />
      </div> */}
      <div className="rounded-md border">
        <DetailsDialog
          open={isDetailsModalOpen}
          onOpenChange={() => setIsDetaisModalOpen(!isDetailsModalOpen)}
          selectedBill={selectedBill}
        />
        <Table>
          <TableHeader
            headerGroups={table.getHeaderGroups()}
            flexRender={(header, context) => flexRender(header, context) as JSX.Element}
          />
          <TableBody>
            {filteredData.length ? (
              filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => handleDetailsOpen(row.original)}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell
                      key={cell.id}
                      className={index === row.getVisibleCells().length - 1 ? 'text-right' : ''}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination
        totalPages={Math.ceil(totalSelector / 10)}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
}

'use client';

import React, { useState, useEffect, MouseEvent } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlinedIcon } from '@heroicons/react/24/outline';
import DetailsDialog from '@/components/organisms/dialog/details-dialog';
import { useSelector, useDispatch } from 'react-redux';
import { addBills, addFavourite, removeFavourite } from '@/redux/slices/legislationSlice';
import { usePagination } from '@/components/organisms/table/hooks/usePagination';
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Box,
  Snackbar,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

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
  };
};

export function DataTable({ currentPage }: { currentPage: number }) {
  const dispatch = useDispatch();
  const billsSelector = useSelector((state: ReduxState) => state.legislation.bills);
  const totalSelector = useSelector((state: ReduxState) => state.legislation.total);
  const favouritesSelector = useSelector((state: ReduxState) => state.legislation.favourites);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isDetailsModalOpen, setIsDetaisModalOpen] = useState(false);

  useEffect(() => {
    const loadedFavourites = localStorage.getItem('favourites');
    if (loadedFavourites) {
      JSON.parse(loadedFavourites).forEach((favourite: Bill) => dispatch(addFavourite(favourite)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('favourites', JSON.stringify(favouritesSelector));
  }, [favouritesSelector]);

  const handleFavourite = (e: MouseEvent, bill: Bill) => {
    e.preventDefault();
    e.stopPropagation();
    const isFavourite = favouritesSelector.some((fav) => fav.uri === bill.uri);
    dispatch(isFavourite ? removeFavourite(bill) : addFavourite(bill));
    setSnackbarOpen(true);
    setSnackbarMessage(isFavourite ? 'Removed from favourites' : 'Added to favourites');
  };

  const columns = [
    { field: 'number', headerName: 'Bill number', width: 90 },
    {
      field: 'type',
      headerName: 'Bill type',
      width: 150,
      editable: true,
    },
    {
      field: 'status',
      headerName: 'Bill status',
      width: 150,
      editable: true,
    },
    {
      field: 'sponsor',
      headerName: 'Bill sponsor',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'actions',
      headerName: '',
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
    };

    fetchData();
  }, [dispatch, currentPage]);

  const { handlePageChange } = usePagination();

  const handleDetailsOpen = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDetaisModalOpen(true);
  };

  const [tabValue, setTabValue] = React.useState('bills');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <div className="w-full">
      <h1 className="my-4 text-4xl">Dashboard</h1>
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
          onOpenChange={() => setIsDetaisModalOpen(false)}
          selectedBill={selectedBill}
        />
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleTabChange} aria-label="Bills or favourites">
              <Tab label="Bills" value="bills" />
              <Tab label="Favourites" value="favourites" />
            </TabList>
          </Box>
          <TabPanel value="bills">
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map((column, i) => (
                      <TableCell key={`column-${i}`}>{column.headerName}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billsSelector.map((bill, i) => (
                    <TableRow key={`bill-${i}`} onClick={() => handleDetailsOpen(bill)}>
                      <TableCell>{bill.number}</TableCell>
                      <TableCell>{bill.type}</TableCell>
                      <TableCell>{bill.status}</TableCell>
                      <TableCell>{bill.sponsor}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          className="h-8 w-8 p-0"
                          data-testid="favourite-button"
                          onClick={(e) => handleFavourite(e, bill)}
                        >
                          {favouritesSelector.some((fav) => fav.uri === bill.uri) ? (
                            <StarIcon className="h-4 w-4" />
                          ) : (
                            <StarOutlinedIcon className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                // @ts-expect-error: Error
                onPageChange={handlePageChange}
                page={currentPage - 1}
                count={Math.ceil(totalSelector / 10)}
                rowsPerPage={10}
                rowsPerPageOptions={[10]}
              />
            </Box>
          </TabPanel>
          <TabPanel value="favourites">
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column, i) => (
                    <TableCell key={`column-${i}`}>{column.headerName}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {favouritesSelector.map((bill, i) => (
                  <TableRow key={`bill-${i}`} onClick={() => handleDetailsOpen(bill)}>
                    <TableCell>{bill.number}</TableCell>
                    <TableCell>{bill.type}</TableCell>
                    <TableCell>{bill.status}</TableCell>
                    <TableCell>{bill.sponsor}</TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        className="h-8 w-8 p-0"
                        data-testid="favourite-button"
                        onClick={(e) => handleFavourite(e, bill)}
                      >
                        <StarIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabPanel>
        </TabContext>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

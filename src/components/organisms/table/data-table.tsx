'use client';

import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlinedIcon } from '@heroicons/react/24/outline';
import DetailsDialog from '@/components/organisms/dialog/details-dialog';
import { useFavourites } from '@/components/organisms/table/hooks/useFavourites';
import { useBills } from '@/components/organisms/table/hooks/useBills';
import { useSnackbar } from '@/components/organisms/table/hooks/useSnackbar';
import {
  Input,
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
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isDetailsModalOpen, setIsDetaisModalOpen] = useState(false);

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

  const handleDetailsOpen = (bill: Bill) => {
    setSelectedBill(bill);
    setIsDetaisModalOpen(true);
  };

  const [tabValue, setTabValue] = React.useState('bills');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  const {
    snackbarOpen,
    snackbarMessage,
    setSnackbarOpen,
    setSnackbarMessage,
    handleCloseSnackbar,
  } = useSnackbar();
  const { favourites, handleFavourite } = useFavourites(setSnackbarOpen, setSnackbarMessage);
  const [searchValue, setSearchValue] = useState('');
  const { bills, total, handlePageChange } = useBills(currentPage, searchValue);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div className="w-full">
      <h1 className="my-4 text-4xl">Dashboard</h1>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by type"
          value={searchValue}
          onChange={(event) => handleSearchChange(event.target.value)}
          className="max-w-48 lg:max-w-xs"
        />
      </div>
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
                  {bills.map((bill, i) => (
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
                          // @ts-expect-error: Error
                          onClick={(e) => handleFavourite(e, bill)}
                        >
                          {favourites.some((fav) => fav.uri === bill.uri) ? (
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
                count={Math.ceil(total / 10)}
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
                {favourites.map((bill, i) => (
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
                        // @ts-expect-error: Error
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

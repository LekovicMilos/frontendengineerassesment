'use client';

import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutlinedIcon } from '@heroicons/react/24/outline';
import DetailsDialog from '@/components/organisms/dialog/details-dialog';
import { useFavourites } from '@/components/organisms/table/hooks/useFavourites';
import { useBills } from '@/components/organisms/table/hooks/useBills';
import { useSnackbar } from '@/components/organisms/table/hooks/useSnackbar';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
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
  FormControl,
  Typography,
  MenuItem,
  Select,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
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
  const searchParams = useSearchParams();
  const billStatusParam = searchParams.get('bill_status') || '';
  const billNumberParam = searchParams.get('bill_no') || '';
  const [filterField, setFilterField] = React.useState(billStatusParam ? 'bill_status' : 'bill_no');

  const handleFilterFieldChange = (event: SelectChangeEvent) => {
    setFilterField(event.target.value as string);
    setSearchValue({ field: event.target.value, value: '' });
    replace(`${pathname}?page=${1}`);
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
  const [searchValue, setSearchValue] = useState({
    field: billStatusParam ? 'bill_status' : 'bill_no',
    value: billStatusParam ? billStatusParam : billNumberParam ?? '',
  });
  const { bills, total, handlePageChange } = useBills(currentPage, searchValue);
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearchChange = (value: string) => {
    setSearchValue((prevState) => ({ ...prevState, value }));
    replace(
      `${pathname}?page=${1}${searchValue.field === 'bill_status' ? `&bill_status=${value}` : ''}${searchValue.field === 'bill_no' ? `&bill_no=${value}` : ''}`,
    );
  };

  return (
    <div className="w-full">
      <h1 className="my-4 text-4xl">Dashboard</h1>
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
              <div className="flex items-center py-4">
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth variant="standard">
                    <Input
                      placeholder="Filter by"
                      value={searchValue.value}
                      onChange={(event) => handleSearchChange(event.target.value)}
                      className="mr-4 max-w-48 lg:max-w-xs"
                    />
                  </FormControl>
                </Box>
                <Box sx={{ minWidth: 120, marginRight: 2 }}>
                  <FormControl fullWidth variant="standard">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={filterField}
                      label="Filter field"
                      onChange={handleFilterFieldChange}
                      defaultValue="bill_no"
                    >
                      <MenuItem value="bill_no">Number</MenuItem>
                      <MenuItem value="bill_status">Status</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                {filterField === 'bill_status' ? (
                  <Typography variant="caption">
                    Status can be Current, Withdrawn, Enacted, Rejected, Defeated or Lapsed
                  </Typography>
                ) : null}
              </div>
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

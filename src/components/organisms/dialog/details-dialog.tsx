'use client';

import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

interface DetailsDialogProps {
  open: boolean;
  onOpenChange: () => void;
  selectedBill: Bill | null;
}

type Bill = {
  number: string;
  type: string;
  status: string;
  sponsor: string;
  longTitleEn: string;
  longTitleGa: string;
  uri: string;
};

const DetailsDialog: React.FC<DetailsDialogProps> = ({ open, onOpenChange, selectedBill }) => {
  const [value, setValue] = React.useState('english');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onOpenChange}>
      <DialogTitle>Bill details</DialogTitle>
      <DialogContent className="sm:max-w-[425px]">
        {!selectedBill ? <p>No data</p> : null}
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="English or Gaeilge title">
              <Tab label="English" value="english" />
              <Tab label="Gaeilge" value="gaeilge" />
            </TabList>
          </Box>
          <TabPanel value="english">
            <div dangerouslySetInnerHTML={{ __html: selectedBill?.longTitleEn || '' }} />
          </TabPanel>
          <TabPanel value="gaeilge">
            <div dangerouslySetInnerHTML={{ __html: selectedBill?.longTitleGa || '' }} />
          </TabPanel>
        </TabContext>
        <span className="text-md mb-2 mt-2 block">
          <span className="font-bold">Bill number:</span> {selectedBill?.number}
        </span>
        <span className="text-md mb-2 block">
          <span className="font-bold">Type:</span> #{selectedBill?.type}
        </span>
        <span className="text-md mb-2 block">
          <span className="font-bold">Status:</span> {selectedBill?.status}
        </span>
        <span className="text-md mb-2 block">
          <span className="font-bold">Sponsor:</span> {selectedBill?.sponsor}
        </span>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;

'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bill details</DialogTitle>
          {!selectedBill ? <p>No data</p> : null}
          <DialogDescription>
            <Tabs defaultValue="english" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="gaeilge">Gaeilge</TabsTrigger>
              </TabsList>
              <TabsContent value="english">
                <div dangerouslySetInnerHTML={{ __html: selectedBill?.longTitleEn || '' }} />
              </TabsContent>
              <TabsContent value="gaeilge">
                <div dangerouslySetInnerHTML={{ __html: selectedBill?.longTitleGa || '' }} />
              </TabsContent>
            </Tabs>
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DetailsDialog;

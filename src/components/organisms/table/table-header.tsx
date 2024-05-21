import React from 'react';
import { TableHead, TableHeader as TableHeaderComponent, TableRow } from '@/components/ui/table';

type HeaderGroupType = {
  headers: any[];
  depth: number;
  id: string;
};

interface TableHeaderProps {
  headerGroups: HeaderGroupType[];
  flexRender: (header: any, context: any) => JSX.Element | undefined | null;
}

const TableHeader: React.FC<TableHeaderProps> = ({ headerGroups, flexRender }) => {
  return (
    <TableHeaderComponent>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header: any) => {
            // Add type annotation to 'header' parameter
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeaderComponent>
  );
};

export default TableHeader;

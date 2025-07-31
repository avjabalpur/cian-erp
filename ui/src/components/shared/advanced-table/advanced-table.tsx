import React from 'react';
import TanstackTableWrapper from './advanced-table-wrapper';
import { AdvancedTableProps } from './types';

const AdvancedTable: React.FC<AdvancedTableProps> = (props) => {
  return <TanstackTableWrapper {...props} />;
};

export default AdvancedTable; 
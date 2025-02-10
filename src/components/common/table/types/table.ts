export type ColumnName = {
    key: string;
    label: string;
    opcional: boolean;
  };
  
export type TablaGenericaProps<T> = {
    data: T[];
    columnNames: ColumnName[];
    RowDetailsComponent?: React.ComponentType<{ selectedRow: T }>;
  };


export type ColumnName = {
    key: string;
    label: string;
    opcional?: boolean;
  };
  
  export interface TablaGenericaProps<T> {
    data: T[];
    columnNames: ColumnName[];
    showActions?: boolean;
    showFilter?: boolean;
    showPagination?: boolean;
    // Propiedades para paginación manual (server-side)
    manualPagination?: boolean;
    pageCount?: number;
    currentPage?: number;
    onPageChange?: (page: number) => void;
  }
  
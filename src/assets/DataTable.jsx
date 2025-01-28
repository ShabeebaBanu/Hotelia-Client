import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

const DataTable = ({ columns, rows, page, rowsPerPage, onPageChange, onRowsPerPageChange, onActionClick }) => {
  return (
    <>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="reusable table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: 'var(--shadow-color)',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.roomNo}>
                {columns.map((column) => {
                  const value = row[column.id];
                  if (column.id === 'action') {
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {row.status === 'Available' && (
                          <Button
                            style={{ backgroundColor: 'var(--green)' }}
                            variant="contained"
                            color="primary"
                            onClick={() => onActionClick(row)}
                          >
                            Book Now
                          </Button>
                        )}
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </>
  );
};

export default DataTable;

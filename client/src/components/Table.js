import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export default function MetaphorsTable({ data }) {
  return (
    data && data.length!= 0 && <TableContainer component={Paper}>
      <Typography fontSize={13} fontStyle={'italic'}>Number of results: {data.length}</Typography>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Poem Name</TableCell>
            <TableCell align="right">Poet</TableCell>
            <TableCell align="right">Line</TableCell>
            <TableCell align="right">Metaphorical Term</TableCell>
            <TableCell align="right">Soruce Domain</TableCell>
            <TableCell align="right">Target Domain</TableCell>
            <TableCell align="right">Meaning</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((metaphor) => (
            <TableRow
              key={metaphor._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {metaphor._source.poem_name}
              </TableCell>
              <TableCell align="right">{metaphor._source.poet}</TableCell>
              <TableCell align="right">{metaphor._source.line}</TableCell>
              <TableCell align="right">{metaphor._source.metaphorical_terms}</TableCell>
              <TableCell align="right">{metaphor._source.source_domain}</TableCell>
              <TableCell align="right">{metaphor._source.target_domain}</TableCell>
              <TableCell align="right">{metaphor._source.meaning}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
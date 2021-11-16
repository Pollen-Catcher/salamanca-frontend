import React from 'react';
import { useTable, useSortBy } from 'react-table';
import Styles from './styles';

function Table(props) {
  const data = props.data;
  const columns = React.useMemo(() =>
    [{
      Header: 'Spreadsheet',
      columns:
        [{ Header: 'Polen', accessor: 'polen', sortType: 'basic' },
        { Header: '0 - 1', accessor: '_00h', },
        { Header: '1 - 2', accessor: '_01h', },
        { Header: '2 - 3', accessor: '_02h', },
        { Header: '3 - 4', accessor: '_03h', },
        { Header: '4 - 5', accessor: '_04h', },
        { Header: '5 - 6', accessor: '_05h', },
        { Header: '6 - 7', accessor: '_06h', },
        { Header: '7 - 8', accessor: '_07h', },
        { Header: '8 - 9', accessor: '_08h', },
        { Header: '9 - 10', accessor: '_09h', },
        { Header: '10 - 11', accessor: '_10h', },
        { Header: '11 - 12', accessor: '_11h', },
        { Header: '12 - 13', accessor: '_12h', },
        { Header: '13 - 14', accessor: '_13h', },
        { Header: '14 - 15', accessor: '_14h', },
        { Header: '15 - 16', accessor: '_15h', },
        { Header: '16 - 17', accessor: '_16h', },
        { Header: '17 - 18', accessor: '_17h', },
        { Header: '18 - 19', accessor: '_18h', },
        { Header: '19 - 20', accessor: '_19h', },
        { Header: '20 - 21', accessor: '_20h', },
        { Header: '21 - 22', accessor: '_21h', },
        { Header: '22 - 23', accessor: '_22h', },
        { Header: '23 - 24', accessor: '_23h', },
        { Header: 'Total', accessor: '_total', }],
    }], [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data }, useSortBy)


  return (
    <Styles>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}
                >{column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' ↑' : ' ↓') : ''}
                  </span></th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </Styles>
  );
}

export default Table;

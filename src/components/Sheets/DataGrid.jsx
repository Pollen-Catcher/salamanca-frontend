import PropTypes from 'prop-types'
import ReactDataGrid from 'react-data-grid'

import { columns } from '../../data/columns'
import { evenRow, oddRow } from './styles'

function rowKeyGetter(row) {
  return row.id
}

function DataGrid({ pollens }) {
  const rows = pollens.map((p, index) => ({
    positionId: index,
    id: p.id,
    name: p.name,
    ...p.intervals,
  }))

  return (
    <ReactDataGrid
      rowKeyGetter={rowKeyGetter}
      columns={columns}
      rows={rows}
      className="fill-grid"
      rowClass={(row) => (row.positionId % 2 === 0 ? evenRow : oddRow)}
    />
  )
}

DataGrid.propTypes = {
  pollens: PropTypes.array.isRequired,
}

export default DataGrid

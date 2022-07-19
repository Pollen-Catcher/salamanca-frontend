import { css } from '@emotion/css'

export const oddRow = css`
  .rdg-cell {
    background-color: #212529;
    color: white;
  }

  &:hover .rdg-cell {
    background-color: darkblue;
  }
`

export const evenRow = css`
  .rdg-cell {
    background-color: #2c3034;
    color: white;
  }

  &:hover .rdg-cell {
    background-color: darkblue;
  }
`

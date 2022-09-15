import { css } from '@emotion/css'

export const oddRow = css`
  .rdg-cell {
    background-color: #ffffff;
    color: black;
  }

  &:hover .rdg-cell {
    opacity: 85%;
    background-color: #d7e9f0;
  }
`

export const evenRow = css`
  .rdg-cell {
    background-color: #eff0f0;
    color: black;
  }

  &:hover .rdg-cell {
    background-color: #d7e9f0;
  }
`

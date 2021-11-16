import styled from "styled-components";

const Styles = styled.div`
  table {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    border-spacing: 0px;
    background: #f5f5f5;
    border-bottom: 1px solid #b8b8b8;
    width: 3000px;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
      color: black;
      background-color: #f5f5f5;
      text-align: center;
      font-size: 16px;
      border-radius: 50px;
    }

    th,
    td {
      padding: 0.5rem;
      border-bottom: 1px solid #b8b8b8;

      :last-child {
        border-right: 0;
      }
    }

    th {
      background: #157cff;
      color: white;
      font-size: 20px;
      width: 100px;
      height: 30px;
      border-bottom: 1px solid #000;
      font-weight: 600;
    }
  }
`;

export default Styles;

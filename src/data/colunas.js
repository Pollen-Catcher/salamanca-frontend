import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, deleteDoc } from "firebase/firestore";
import db from "../config/firebase";

const deletePolen = async (id) => {
  const currentRef = doc(db, "pollens", id);
  await deleteDoc(currentRef);
};

export default [
  /*{
    field: "actions",
    type: "actions",
    getActions: (params) => [
      <GridActionsCellItem
        icon={<DeleteIcon />}
        label="Delete"
        onClick={() => deletePolen(params.id)}
      />,
    ],
  },*/
  {
    field: "nome",
    headerName: "Nome",
    editable: true,
  },
  {
    field: "_00h",
    headerName: "0 - 1",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_01h",
    headerName: "1 - 2",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_02h",
    headerName: "2 - 3",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_03h",
    headerName: "3 - 4",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_04h",
    headerName: "4 - 5",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_05h",
    headerName: "5 - 6",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_06h",
    headerName: "6 - 7",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_07h",
    headerName: "7 - 8",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_08h",
    headerName: "8 - 9",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_09h",
    headerName: "9 - 10",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_10h",
    headerName: "10 - 11",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_11h",
    headerName: "11 - 12",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
];

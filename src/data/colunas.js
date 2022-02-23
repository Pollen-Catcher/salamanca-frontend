import { GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, deleteDoc } from "firebase/firestore";
import db from "../config/firebase";

const deletePolen = async (id) => {
  const currentRef = doc(db, "pollens", id);
  await deleteDoc(currentRef);
};
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

export const content =  [
  {
    field: "name",
    headerName: "Nome",
    editable: false,
  },
  {
    field: "_0h",
    headerName: "0",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_1h",
    headerName: "1",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_2h",
    headerName: "2",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_3h",
    headerName: "3",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_4h",
    headerName: "4",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_5h",
    headerName: "5",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_6h",
    headerName: "6",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_7h",
    headerName: "7",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_8h",
    headerName: "8",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_9h",
    headerName: "9",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_10h",
    headerName: "10",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_11h",
    headerName: "11",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
  {
    field: "_12h",
    headerName: "12",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_13h",
    headerName: "13",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_14h",
    headerName: "14",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_15h",
    headerName: "15",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_16h",
    headerName: "16",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_17h",
    headerName: "17",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_18h",
    headerName: "18",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_19h",
    headerName: "19",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_20h",
    headerName: "20",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_21h",
    headerName: "21",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_22h",
    headerName: "22",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_23h",
    headerName: "23",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
];

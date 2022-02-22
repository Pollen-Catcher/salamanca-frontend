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

const conteudo =  [
  {
    field: "name",
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
  {
    field: "_12h",
    headerName: "12 - 13",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_13h",
    headerName: "13 - 14",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_14h",
    headerName: "14 - 15",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_15h",
    headerName: "15 - 16",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_16h",
    headerName: "16 - 17",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_17h",
    headerName: "17 - 18",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_18h",
    headerName: "18 - 19",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_19h",
    headerName: "19 - 20",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_20h",
    headerName: "20 - 21",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_21h",
    headerName: "21 - 22",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_22h",
    headerName: "22 - 23",
    type: "number",
    headerAlign: "center",
    editable: true,
  },{
    field: "_23h",
    headerName: "23 - 00",
    type: "number",
    headerAlign: "center",
    editable: true,
  },
];

export default conteudo;

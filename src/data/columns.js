import { deleteDoc, doc } from "firebase/firestore";
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

export const columns = [
  { key: "name", name: "Name" },
  { key: "_0h", name: "0" },
  { key: "_1h", name: "1" },
  { key: "_2h", name: "2" },
  { key: "_3h", name: "3" },
  { key: "_4h", name: "4" },
  { key: "_5h", name: "5" },
  { key: "_6h", name: "6" },
  { key: "_7h", name: "7" },
  { key: "_8h", name: "8" },
  { key: "_9h", name: "9" },
  { key: "_10h", name: "10" },
  { key: "_11h", name: "11" },
  { key: "_12h", name: "12" },
  { key: "_13h", name: "13" },
  { key: "_14h", name: "14" },
  { key: "_15h", name: "15" },
  { key: "_16h", name: "16" },
  { key: "_17h", name: "17" },
  { key: "_18h", name: "18" },
  { key: "_19h", name: "19" },
  { key: "_20h", name: "20" },
  { key: "_21h", name: "21" },
  { key: "_22h", name: "22" },
  { key: "_23h", name: "23" },
];

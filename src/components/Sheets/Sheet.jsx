import { Button, Stack, TextField } from "@mui/material";
import DataGrid from "react-data-grid";
import { columns } from "../../data/columns";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Speech } from "../../components";
import { evenRow, oddRow } from "./styles";

function Sheets({
  setName,
  pollens,
  sheetId,
  loading,
  addPollen,
  handleEdit,
}) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            p: 2,
            width: '15%',
            backgroundColor: '#e8e8e8',
            border: '1px solid #e8e8e8',
            borderRadius: '5px'
          }}>
          <Typography
            noWrap
            align="center"
            component="div"
            style={{ color: "#081627" }}
            sx={{ display: { xs: "5", sm: "block" } }}
          >
            Add a New Name
          </Typography>
          <br />

          <Stack direction={"row"} spacing={2}>
            <TextField id="standard-basic" label="Name" variant="standard" onChange={(e) => setName(e.target.value)} />
            <Box>
              <Button color={"primary"} variant={"contained"} onClick={addPollen} className="bg-black">
                {" "}
                Add
              </Button>
            </Box>
          </Stack>

        </Box>
        <Box flex
          sx={{
            p: 2,
            width: '20%',
            backgroundColor: '#e8e8e8',
            border: '1px solid #e8e8e8',
            borderRadius: '5px',
            marginLeft: "5%",
          }}>
          <Typography
            noWrap
            component="div"
            style={{ color: "#081627" }}
            sx={{ display: { xs: "none", sm: "block" } }}
            align="center"
          >
            Click to Start Listening
          </Typography>
          <br />
          <Speech pollens={pollens} sheetId={sheetId} />
        </Box>
      </Box>
      <br />
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} />
      <div align="left" style={{ width: "100%" }}>
        <Box sx={{ display: "flex-inline" }}>
          <br />
          <Typography
            noWrap
            variant="h6"
            component="div"
            style={{ color: "#b6b5b5" }}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            View and Edit
          </Typography>
          <br />
          <Box>
            <Box>
              {pollens && (
                <DataGrid
                  columns={columns}
                  rows={pollens.map((p, index) => ({
                    positionId: index,
                    id: p.id,
                    name: p.name,
                    ...p.intervals,
                  }))}
                  className="fill-grid"
                  rowClass={(row) =>
                    row.positionId % 2 === 0 ? evenRow : oddRow
                  }
                />
              )}
            </Box>
          </Box>
        </Box>
      </div>
    </>
  );
}

export default Sheets;

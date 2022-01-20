import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { Search, Refresh } from "@mui/icons-material";
import { CreateSheetBox } from "./styles";
import PropTypes from "prop-types";

function Content({
  openCreateSheet,
  handleOpenCreateSheet,
  handleCloseCreateSheet,
  handleSubmit,
  control,
  addSheet,
  sheets,
}) {
  return (
    <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Search color="inherit" sx={{ display: "block" }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search by name"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "default" },
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                sx={{ mr: 1 }}
                onClick={handleOpenCreateSheet}
              >
                Create New Sheet
              </Button>
              <Dialog
                open={openCreateSheet}
                onClose={handleCloseCreateSheet}
                disableEnforceFocus
              >
                <form onSubmit={handleSubmit((data) => addSheet(data))}>
                  <DialogContent>
                    <DialogTitle>Type the sheet name</DialogTitle>
                    <CreateSheetBox>
                      <DialogContentText>
                        Fill in the blanks to generate a new work
                      </DialogContentText>
                      <Controller
                        render={({ field }) => (
                          <TextField
                            label={"Name"}
                            variant={"outlined"}
                            {...field}
                          />
                        )}
                        name="name"
                        control={control}
                      />
                      <Controller
                        render={({ field }) => (
                          <TextField
                            label={"Location"}
                            variant={"outlined"}
                            {...field}
                          />
                        )}
                        name="location"
                        control={control}
                      />
                    </CreateSheetBox>
                    <DialogActions
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color={"secondary"}
                        type={"submit"}
                      >
                        Add Sheet
                      </Button>
                    </DialogActions>
                  </DialogContent>
                </form>
              </Dialog>
              <Tooltip title="Reload">
                <IconButton>
                  <Refresh color="inherit" sx={{ display: "block" }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Typography sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
        Your projects will appear here...
      </Typography>
    </Paper>
  );
}

Content.propTypes = {
  openCreateSheet: PropTypes.bool.isRequired,
  handleOpenCreateSheet: PropTypes.func.isRequired,
  handleCloseCreateSheet: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  control: PropTypes.any.isRequired,
  addSheet: PropTypes.func.isRequired,
  sheets: PropTypes.array.isRequired,
};

export default Content;

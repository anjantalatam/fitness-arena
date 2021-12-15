import { Box, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Switch, TextField } from "@mui/material";
import { Checkbox } from "@mui/material";
import lodash from "lodash";

const people = [
  {
    id: "workedOut",
    label: "Worked Out",
  },
  {
    id: "trainer",
    label: "Trainer",
  },
];

export default function WorkoutCard({
  datedData,
  setDatedData,
  enableServerButton,
  updateData,
  defaultData,
}) {
  const { isGymOpen } = datedData;

  const handleCardChanges = ({ target }) => {
    let clonedData = lodash.cloneDeep(datedData);
    const { id } = target;

    if (id === "notes") {
      clonedData["notes"] = target.value;
    } else if (id === "isGymOpen" && !target.checked) {
      clonedData = defaultData;
    } else {
      clonedData[id] = target.checked;
    }

    setDatedData(clonedData);
  };

  return (
    <Box maxWidth={250} my={3}>
      <Card>
        <Box px={2}>
          <CardContent>
            <Typography>
              Is Gym Open &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Switch
                checked={isGymOpen}
                id={"isGymOpen"}
                onChange={handleCardChanges}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Typography>
            {isGymOpen && (
              <Box>
                {people.map((person) => (
                  <Box key={person.id}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item xs={9}>
                        {lodash.startCase(person.label)}
                      </Grid>
                      <Grid item xs={3}>
                        <Checkbox
                          id={person.id}
                          checked={datedData[person.id]}
                          onChange={handleCardChanges}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                <Box my={1}>
                  <TextField
                    label="Notes"
                    id="notes"
                    value={datedData["notes"]}
                    onChange={handleCardChanges}
                    multiline
                    rows={4}
                  />
                </Box>
              </Box>
            )}
          </CardContent>

          <CardActions>
            <Button
              variant="contained"
              onClick={updateData}
              disabled={!enableServerButton}
              fullWidth
            >
              Update in Server
            </Button>
          </CardActions>
        </Box>
      </Card>
    </Box>
  );
}

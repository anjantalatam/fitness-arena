import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Grid,
  IconButton,
  Switch,
  Tooltip,
} from "@mui/material";
import lodash from "lodash";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function TeamStatusCard({
  data,
  type,
  setData,
  enableServerButton = false,
  updateData,
  teamUniqueId = "",
}) {
  const cardData = lodash.get(data, [type]) || {};
  const [collapse, setCollapse] = useState(false);
  // console.log(collapse);

  const handleCardChanges = ({ target }) => {
    let clonedData = lodash.cloneDeep(data);
    let clonedCardData = lodash.cloneDeep(cardData);

    const { id } = target;

    clonedCardData[id].status = target.checked;
    clonedData[type] = clonedCardData;

    setData(clonedData);
  };

  return (
    <Box maxWidth={250} my={3} minWidth={230}>
      <Card>
        <CardHeader
          // avatar={
          //   <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
          //     R
          //   </Avatar>
          // }
          action={
            <Tooltip title="Toggle View">
              <IconButton
                aria-label="settings"
                onClick={() => setCollapse(!collapse)}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          }
          title={lodash.startCase(type)}
          // subheader={teamUniqueId && <CopyToClipboard value={teamUniqueId} />}
        />
        {!collapse && (
          <Box px={2}>
            <CardContent>
              <Box>
                {Object.keys(cardData).map((id) => {
                  const { title, status } = cardData[id];
                  return (
                    <Box key={id}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item xs={9}>
                          {lodash.startCase(title)}
                        </Grid>
                        <Grid item xs={3}>
                          {!!setData ? (
                            <Switch
                              id={id}
                              checked={status}
                              onChange={handleCardChanges}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          ) : (
                            <Tooltip title="Read-only Field">
                              <Checkbox
                                id={id}
                                checked={status}
                                // This field cannot be changed
                                // removed disabled to enable tooltip
                                // disabled={!!!setData}
                              />
                            </Tooltip>
                          )}
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>

            <CardActions>
              {!!setData && (
                <Button
                  variant="contained"
                  onClick={updateData}
                  disabled={!enableServerButton}
                  fullWidth
                >
                  Update in Server
                </Button>
              )}
            </CardActions>
          </Box>
        )}
      </Card>
    </Box>
  );
}

export default TeamStatusCard;

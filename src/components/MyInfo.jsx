import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { Box } from "@mui/system";
import { startCase } from "lodash";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import Verified from "@mui/icons-material/CheckCircle";

function MyInfo() {
  const { username, useremail, isEmailVerified } = useAuth();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      my={5}>
      <Paper>
        <Box minWidth={"400px"}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Key</TableCell>
                  <TableCell>Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>
                    <Button
                      // className={classes.buttoned}
                      style={{
                        pointerEvents: "none",
                      }}
                      endIcon={
                        isEmailVerified && (
                          <Tooltip title="Verified">
                            <Verified color="success" />
                          </Tooltip>
                        )
                      }>
                      {startCase(username)}
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>{useremail}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weight</TableCell>
                  <TableCell>{"weight"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
}

export default MyInfo;

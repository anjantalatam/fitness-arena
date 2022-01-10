import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import lodash, { cloneDeep } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase-config";
import { useAuth } from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import moment from "moment";
import { getDefaultTeamData } from "../firebase/helper-firestore";
import TeamsActionCard from "./TeamsActionCard";

function Teams() {
  const [teams, setTeams] = useState({});
  const { uid, username } = useAuth();
  const navigate = useNavigate();
  const enqueueSnackbar = useSnackbar();

  const usersCollectionRef = useMemo(() => collection(db, "users"), []);
  const teamsCollectionRef = useMemo(() => collection(db, "teams"), []);
  const docRef = useMemo(
    () => doc(usersCollectionRef, uid),
    [uid, usersCollectionRef]
  );
  const teamsDataCollectionRef = useMemo(
    () => collection(db, "teams", "teamsAutoId1", "teams-data"),
    []
  );

  useEffect(() => {
    const getTeams = async () => {
      try {
        const docData = await getDoc(docRef);
        const teams = docData.data()?.teams;
        const teamsData = {};

        for (let i = 0; i < teams.length; i++) {
          const docRef = doc(teamsDataCollectionRef, teams[i]);
          const docData = await getDoc(docRef);
          teamsData[teams[i]] = docData.data();
        }
        setTeams(teamsData || {});
      } catch (e) {
        enqueueSnackbar(e);
      }
    };
    console.log("object");
    getTeams();
  }, [docRef, enqueueSnackbar, teamsDataCollectionRef]);

  const getInitialDefaultData = (defaultTeamData, teamName) => {
    const clonedDefaultTeamData = cloneDeep(defaultTeamData);
    const teamNameValue = teamName || `Team-${moment().format("x")}`;

    lodash.set(clonedDefaultTeamData, ["defaultData", "teamMembers"], {
      [uid]: {
        status: false,
        title: lodash.startCase(username),
      },
    });
    lodash.set(clonedDefaultTeamData, "members", [
      { uid: uid, username: username },
    ]);
    lodash.set(clonedDefaultTeamData, "teamName", teamNameValue);

    return clonedDefaultTeamData;
  };

  const createNewTeam = async (teamName) => {
    try {
      // create teams
      const usersDocRef = doc(usersCollectionRef, uid);
      const usersDocData = await getDoc(usersDocRef);

      const defaultTeamData = await getDefaultTeamData();
      const newTeamInitialtData = getInitialDefaultData(
        defaultTeamData,
        teamName
      );
      const { teams } = cloneDeep(usersDocData.data()) || [];
      const newTeamDocRef = await addDoc(
        teamsDataCollectionRef,
        newTeamInitialtData
      );

      teams.push(newTeamDocRef.id);
      await updateDoc(usersDocRef, {
        teams,
      });
      const teamsDocRef = doc(teamsCollectionRef, "teamsAutoId1");
      const teamsDocData = await getDoc(teamsDocRef);

      if (teamsDocData.exists()) {
        const teamIds = lodash.get(teamsDocData.data(), "teamIds") || [];
        teamIds.push(newTeamDocRef.id);
        await updateDoc(teamsDocRef, {
          teamIds: teamIds,
        });
        console.log(teamsDocData.data());
      } else {
        const initialTeamsDocData = {
          defaultTeamData,
          teamIds: [newTeamDocRef.id],
        };
        await setDoc(teamsDocRef, initialTeamsDocData);
      }
      enqueueSnackbar(`Created Team - ${teamName}!`, "success");
    } catch (e) {
      enqueueSnackbar(e);
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      mt={3}
    >
      <Box
        display={"flex"}
        justifyContent="center"
        flexWrap={"wrap"}
        width={"100%"}
      >
        <TeamsActionCard
          title="Join a Team"
          placeholder="Enter Unique Team Id"
          action="join"
        />

        <TeamsActionCard
          title="Create a Team"
          placeholder="Enter your Team Name"
          action="create"
          createNewTeam={createNewTeam}
        />
      </Box>

      <Paper style={{ margin: "2rem 0" }}>
        <Box m={2}>
          <Typography variant="h5">Your Teams</Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Number</TableCell>
                  <TableCell>Team Name</TableCell>
                  <TableCell>Number Of Members</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(teams).map((teamId, index) => (
                  <TableRow key={teamId}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{teams[teamId].teamName}</TableCell>

                    <TableCell>{teams[teamId].members.length}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/team/${teamId}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      <Button onClick={createNewTeam}>Create a team</Button>
    </Box>
  );
}

export default Teams;

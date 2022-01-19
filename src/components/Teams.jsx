import {
  Box,
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
import lodash, { cloneDeep, get, startCase } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase-config";
import { useAuth } from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";
import moment from "moment";
import {
  getDefaultTeamData,
  getTeamMembersInTeam,
  getUserData,
  setUsersData,
} from "../firebase/helper-firestore";
import TeamsActionCard from "./TeamsActionCard";
import LaunchIcon from "@mui/icons-material/Launch";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

import ResponsiveButton from "./common/ResponsiveButton";

import { red } from "@mui/material/colors";
import DeleteTeamDialog from "../components/DeleteTeamDialog";
import LeaveTeamDialog from "../components/LeaveTeamDialog";

const warning = red[700];

function Teams() {
  const [teams, setTeams] = useState({});
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [deleteTeamDialogOpen, setDeleteTeamDialogOpen] = useState(false);
  const [leaveTeamDialogOpen, setLeaveTeamDialogOpen] = useState(false);

  const { uid, username } = useAuth();
  const navigate = useNavigate();
  const enqueueSnackbar = useSnackbar();

  const usersCollectionRef = useMemo(() => collection(db, "users"), []);
  const teamsCollectionRef = useMemo(() => collection(db, "teams"), []);
  const userDocRef = useMemo(
    () => doc(usersCollectionRef, uid),
    [uid, usersCollectionRef]
  );
  const teamsDataCollectionRef = useMemo(
    () => collection(teamsCollectionRef, "teamsAutoId1", "teams-data"),
    [teamsCollectionRef]
  );

  useEffect(() => {
    const getTeams = async () => {
      try {
        const userDocData = await getDoc(userDocRef);
        const teams = userDocData.data()?.teams || [];
        const teamsData = {};

        for (let i = 0; i < teams.length; i++) {
          const teamDocRef = doc(teamsDataCollectionRef, teams[i]);
          const teamDocData = await getDoc(teamDocRef);
          teamsData[teams[i]] = teamDocData.data();
        }
        setTeams(teamsData || {});
      } catch (e) {
        enqueueSnackbar(e);
      }
    };
    getTeams();
  }, [userDocRef, enqueueSnackbar, teamsDataCollectionRef]);

  const getInitialDefaultData = (defaultTeamData, teamName) => {
    const clonedDefaultTeamData = cloneDeep(defaultTeamData);
    const teamNameValue = teamName || `Team-${moment().format("x")}`;

    lodash.set(clonedDefaultTeamData, ["teamData", "teamMembers"], {
      [uid]: {
        status: false,
        title: startCase(username),
      },
    });
    lodash.set(clonedDefaultTeamData, "members", [
      { uid: uid, username: startCase(username) },
    ]);
    lodash.set(clonedDefaultTeamData, "teamName", teamNameValue);
    lodash.set(clonedDefaultTeamData, "admins", [uid]);

    return clonedDefaultTeamData;
  };

  const joinATeam = async (teamUniqueId) => {
    try {
      const teamsDocRef = doc(teamsCollectionRef, "teamsAutoId1");
      const teamsDocData = await getDoc(teamsDocRef);
      const { teamIds } = teamsDocData.data();
      if (get(teamIds, teamUniqueId)) {
        const usersData = await getUserData(uid);
        if (usersData.teams.length <= 2) {
          // add to list of teams in users
          usersData.teams.push(teamUniqueId);
          console.log(usersData);
          await setUsersData(uid, usersData);

          // add to teamMembers list and members list of the team.
          const teamDocRef = doc(teamsDataCollectionRef, teamUniqueId);
          const teamDocData = await getDoc(teamDocRef);
          const teamDocumentData = teamDocData.data();

          if (
            teamDocumentData.members.findIndex(
              (member) => member.uid === uid
            ) === -1
          ) {
            teamDocumentData.members.push({ uid, username });
          }
          lodash.set(teamDocumentData, ["teamData", "teamMembers", uid], {
            status: false,
            title: startCase(username),
          });
          await setDoc(teamDocRef, teamDocumentData);

          enqueueSnackbar(
            `Joined Team-${teamDocumentData.teamName}`,
            "success"
          );
        } else {
          enqueueSnackbar(
            "Teams limit[3] exceeded. Leave from a team to join a new one."
          );
        }
      } else {
        enqueueSnackbar("Team Doesn't exist!!. ");
      }
    } catch (e) {
      enqueueSnackbar(e);
    }
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
      const usersDocumentData = cloneDeep(usersDocData.data());
      let teams = get(usersDocumentData, "teams") || [];

      const newTeamDocRef = await addDoc(
        teamsDataCollectionRef,
        newTeamInitialtData
      );

      teams.push(newTeamDocRef.id);
      lodash.set(usersDocumentData, "teams", teams);
      await setDoc(usersDocRef, usersDocumentData);

      const teamsDocRef = doc(teamsCollectionRef, "teamsAutoId1");
      const teamsDocData = await getDoc(teamsDocRef);

      if (teamsDocData.exists()) {
        const teamIds = get(teamsDocData.data(), "teamIds") || {};
        teamIds[newTeamDocRef.id] = true;
        await updateDoc(teamsDocRef, {
          teamIds: teamIds,
        });
      } else {
        const initialTeamsDocData = {
          defaultTeamData,
          teamIds: { [newTeamDocRef.id]: true },
        };
        await setDoc(teamsDocRef, initialTeamsDocData);
      }
      enqueueSnackbar(`Created Team - ${teamName}!`, "success");
    } catch (e) {
      enqueueSnackbar(e);
    }
  };

  const commonLeaveTeam = async (userId) => {
    try {
      // Remove TeamID from User Teams ( field )
      const userData = await getUserData(userId);
      const teamsList = userData.teams;
      const updatedTeams = teamsList.filter((team) => team !== teamId);
      userData.teams = updatedTeams;
      await setUsersData(userId, userData);

      // remove user from team-data
      const clonedTeamData = cloneDeep(
        get(cloneDeep(teams[teamId]), "teamData")
      );
      lodash.unset(clonedTeamData, ["teamMembers", userId]);
      const teamDocRef = doc(teamsDataCollectionRef, teamId);

      await updateDoc(teamDocRef, {
        teamData: clonedTeamData,
      });
    } catch (e) {
      enqueueSnackbar(e);
    }
  };

  const leaveTeam = async () => {
    try {
      await commonLeaveTeam(uid);

      setDeleteTeamDialogOpen(false);
      setLeaveTeamDialogOpen(false);
      enqueueSnackbar(`You left the team - ${teamName}`, "Success");
    } catch (e) {
      enqueueSnackbar(e);
    }
  };

  const deleteTeam = async () => {
    try {
      // Remove teamId from User Teams ( field )
      const teamDocRef = doc(teamsDataCollectionRef, teamId);
      const teamMembers = await getTeamMembersInTeam(teamDocRef);

      for (let i = 0; i < teamMembers.length; i++) {
        await commonLeaveTeam(teamMembers[i]);
      }

      // Set teamId to false
      const teamsDocRef = doc(teamsCollectionRef, "teamsAutoId1");
      const teamsDocData = await getDoc(teamsDocRef);
      const { teamIds } = teamsDocData.data();
      teamIds[teamId] = false;
      await updateDoc(teamsDocRef, {
        teamIds: teamIds,
      });

      // Don't Delete Complete Document

      setDeleteTeamDialogOpen(false);
      enqueueSnackbar(`Deleted Team-${teamName}`, "success");
    } catch (e) {
      enqueueSnackbar(e);
    }
  };

  const handleDeleteTeam = (teamId, teamName) => {
    setTeamId(teamId);
    setTeamName(teamName);
    setDeleteTeamDialogOpen(true);
  };

  const handleLeaveTeam = (teamId, teamName) => {
    setTeamId(teamId);
    setTeamName(teamName);
    setLeaveTeamDialogOpen(true);
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
          actionFunction={joinATeam}
        />

        <TeamsActionCard
          title="Create a Team"
          placeholder="Enter your Team Name"
          action="create"
          actionFunction={createNewTeam}
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
                {(Object.keys(teams).length > 0 &&
                  Object.keys(teams).map((teamId, index) => {
                    const { teamName, admins, teamData } = teams[teamId];
                    const members = Object.keys(teamData?.teamMembers || {});
                    const isAdmin = admins.includes(uid);

                    return (
                      <TableRow key={teamId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{teamName}</TableCell>

                        <TableCell>{members.length}</TableCell>
                        <TableCell>
                          <Box display="flex">
                            <ResponsiveButton
                              button={{ title: "View", variant: "contained" }}
                              iconButton={{
                                icon: <LaunchIcon color="primary" />,
                              }}
                              tooltip="View"
                              onClick={() => navigate(`/team/${teamId}`)}
                            />

                            <ResponsiveButton
                              button={{
                                title: isAdmin ? "Delete" : "Leave",
                                variant: "contained",
                                color: warning,
                              }}
                              iconButton={{
                                icon: (
                                  <RemoveCircleIcon
                                    style={{ color: warning }}
                                  />
                                ),
                              }}
                              tooltip={isAdmin ? "Delete" : "Leave"}
                              onClick={
                                isAdmin
                                  ? () => handleDeleteTeam(teamId, teamName)
                                  : () => handleLeaveTeam(teamId, teamName)
                              }
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })) || (
                  <TableRow>
                    <TableCell>No Data</TableCell>
                    <TableCell>No Data</TableCell>
                    <TableCell>No Data</TableCell>
                    <TableCell>No Data</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      <DeleteTeamDialog
        open={deleteTeamDialogOpen}
        setOpen={setDeleteTeamDialogOpen}
        teamName={teamName}
        deleteTeam={deleteTeam}
        leaveTeam={leaveTeam}
      />
      <LeaveTeamDialog
        open={leaveTeamDialogOpen}
        setOpen={setLeaveTeamDialogOpen}
        teamName={teamName}
        leaveTeam={leaveTeam}
      />
    </Box>
  );
}

export default Teams;

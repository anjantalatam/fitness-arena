import React, { useState, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import ArenaTitle from "./ArenaTitle";
import Calendar from "./Calendar";
import WorkoutCard from "./WorkoutCard";
import lodash, { get, set } from "lodash";
import moment from "moment";
import { collection, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";
import { useAuth } from "../hooks/useAuth";
import useSnackbar from "../hooks/useSnackbar";

const defaultData = {
  isGymOpen: false,
  workedOut: false,
  trainer: false,
  notes: "",
};
const today = moment().format("DD-MM-YYYY");

export default function GymCalendar() {
  const { uid } = useAuth();
  const [date, setDate] = useState(moment());
  const [datedData, setDatedData] = useState(defaultData);
  const [initialData, setInitialData] = useState(defaultData);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const enqueueSnackbar = useSnackbar();

  const usersCollectionRef = useMemo(() => collection(db, "users"), []);
  const gymCollectionRef = useMemo(
    () => collection(usersCollectionRef, uid, "gym"),
    [uid, usersCollectionRef]
  );
  const userDocRef = useMemo(
    () => doc(usersCollectionRef, uid),
    [uid, usersCollectionRef]
  );
  const teamsCollectionRef = useMemo(() => collection(db, "teams"), []);
  const teamsDataCollectionRef = useMemo(
    () => collection(teamsCollectionRef, "teamsAutoId1", "teams-data"),
    [teamsCollectionRef]
  );

  useEffect(() => {
    setIsDataChanged(!lodash.isEqual(initialData, datedData));
  }, [initialData, datedData]);

  useEffect(() => {
    const getDatedData = async () => {
      const selectedDate = date?.format("DD-MM-YYYY") || today;
      const datedDocRef = doc(gymCollectionRef, selectedDate);
      const datedDoc = await getDoc(datedDocRef);
      if (datedDoc.exists()) {
        setDatedData(datedDoc.data());
        setInitialData(datedDoc.data());
      } else {
        setDatedData(defaultData);
      }
      // console.log("object");
    };

    getDatedData();
    setInitialData(defaultData);
  }, [date, gymCollectionRef]);

  // For Next release

  // const updateStats = async (selectedDate) => {
  //   const statsDocs = Object.keys(defaultData);

  //   for (let i = 0; i < statsDocs.length; i++) {
  //     const docRef = doc(db, "stats", statsDocs[i]);
  //     const docs = await getDoc(docRef);

  //     if (docs.exists()) {
  //       const currentData = docs.data();

  //       if (statsDocs[i] === "isGymOpen") {
  //         const index = currentData.dates.findIndex(
  //           (item) => item === selectedDate
  //         );
  //         if (datedData[statsDocs[i]] && index === -1) {
  //           currentData.dates.push(selectedDate);
  //         } else if (!datedData[statsDocs[i]] && index !== -1) {
  //           currentData.dates.splice(index, 1);
  //         }
  //       } else {
  //         const index = currentData.leaveDates.findIndex(
  //           (item) => item === selectedDate
  //         );
  //         console.log(index, statsDocs[i]);
  //         if (!datedData[statsDocs[i]] && index === -1 && datedData.isGymOpen) {
  //           currentData.leaveDates.push(selectedDate);
  //         } else if (datedData[statsDocs[i]] && index !== -1) {
  //           currentData.leaveDates.splice(index, 1);
  //         } else if (index !== -1 && !datedData.isGymOpen) {
  //           currentData.leaveDates.splice(index, 1);
  //         }
  //       }
  //       await updateDoc(docRef, currentData);
  //     } else {
  //       console.log("Updating Stats Failed");
  //     }
  //   }
  // };

  const updateTeamStats = async (teamId, status, selectedDate) => {
    try {
      const teamDocRef = doc(teamsDataCollectionRef, teamId);
      const datedTeamDocRef = doc(teamDocRef, "team-dates", selectedDate);

      const teamDocData = await getDoc(teamDocRef);
      const datedTeamDocData = await getDoc(datedTeamDocRef);

      const teamDocumentData = teamDocData.data();
      const datedTeamDocumentData =
        datedTeamDocData.data() || teamDocumentData.teamData;

      set(datedTeamDocumentData, ["teamMembers", uid, "status"], status);

      await setDoc(datedTeamDocRef, datedTeamDocumentData);
    } catch (e) {
      enqueueSnackbar(e);
    }
  };

  const handleUpdateData = async () => {
    try {
      const selectedDate = date.format("DD-MM-YYYY");
      const datedDocRef = doc(gymCollectionRef, selectedDate);
      const datedDoc = await getDoc(datedDocRef);
      if (datedDoc.exists()) {
        await updateDoc(datedDocRef, datedData);
      } else {
        await setDoc(datedDocRef, datedData);
      }

      // console.log(datedData);

      const userDocData = await getDoc(userDocRef);
      const userTeamsList = get(userDocData.data(), "teams", []);

      for (let i = 0; i < userTeamsList.length; i++) {
        await updateTeamStats(
          userTeamsList[i],
          datedData.workedOut,
          selectedDate
        );
      }

      // const teams = get()

      // await updateStats(selectedDate);
      enqueueSnackbar("Data updated in Server", "success");
      setInitialData(datedData);
    } catch (e) {
      enqueueSnackbar(e);
    }
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        my={5}
      >
        <ArenaTitle title={"Fitness Arena"} version={"1.7.1"} />
        <Calendar date={date} setDate={setDate} />
        <WorkoutCard
          datedData={datedData}
          setDatedData={setDatedData}
          enableServerButton={isDataChanged}
          updateData={handleUpdateData}
          defaultData={defaultData}
        />
      </Box>
    </>
  );
}

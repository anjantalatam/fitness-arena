import React, { useEffect, useMemo, useState } from "react";
import { doc, getDoc, collection, updateDoc, setDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase-config";
import { Box } from "@mui/system";
import ArenaTitle from "./ArenaTitle";
import Calendar from "./Calendar";
import moment from "moment";
import lodash from "lodash";
import TeamStatusCard from "./TeamStatusCard";
import useSnackbar from "../hooks/useSnackbar";
import CopyToClipboard from "./common/CopyToClipboard";

const today = moment().format("DD-MM-YYYY");

function Team() {
  const [date, setDate] = useState(moment());
  const [defaultData, setDefaultData] = useState({});
  const [teamData, setTeamData] = useState({});
  const [datedData, setDatedData] = useState({});
  const [initialData, setInitialData] = useState({});
  const [isDataChanged, setIsDataChanged] = useState(false);

  const enqueueSnackbar = useSnackbar();

  const { teamId } = useParams();
  const teamsDataCollectionRef = useMemo(
    () => collection(db, "teams", "teamsAutoId1", "teams-data"),
    []
  );

  const teamDoc = useMemo(
    () => doc(teamsDataCollectionRef, teamId),
    [teamId, teamsDataCollectionRef]
  );
  const teamDatesCollectionRef = useMemo(
    () => collection(teamDoc, "team-dates"),
    [teamDoc]
  );

  useEffect(() => {
    const getTeamData = async () => {
      const teamDocData = await getDoc(teamDoc);
      setTeamData(teamDocData.data());
    };

    const getDefaultData = async () => {
      const docData = await getDoc(teamDoc);
      const data = docData?.data();
      setDefaultData(data.teamData);
    };

    getDefaultData();
    getTeamData();
  }, [teamDoc, date]);

  useEffect(() => {
    setIsDataChanged(!lodash.isEqual(initialData, datedData));
  }, [initialData, datedData]);

  useEffect(() => {
    const getDatedData = async () => {
      const selectedDate = date?.format("DD-MM-YYYY") || today;
      const datedDocRef = doc(teamDatesCollectionRef, selectedDate);
      const datedDoc = await getDoc(datedDocRef);

      if (datedDoc.exists()) {
        setDatedData(datedDoc.data());
        setInitialData(datedDoc.data());
      } else {
        setDatedData(defaultData);
      }
    };

    getDatedData();
    setInitialData(defaultData);
  }, [date, defaultData, teamDatesCollectionRef]);

  const handleUpdateData = async () => {
    try {
      const selectedDate = date.format("DD-MM-YYYY");
      const datedDocRef = doc(teamDatesCollectionRef, selectedDate);
      const datedDoc = await getDoc(datedDocRef);
      if (datedDoc.exists()) {
        await updateDoc(datedDocRef, datedData);
      } else {
        await setDoc(datedDocRef, datedData);
      }
      enqueueSnackbar("Team Data Updated!", "success");
      setInitialData(datedData);
    } catch (e) {
      enqueueSnackbar(e);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      my={5}>
      <ArenaTitle title={teamData.teamName} />
      <CopyToClipboard value={teamId} mb={3} />

      <Calendar date={date} setDate={setDate} />

      <TeamStatusCard
        data={datedData}
        type={"teamMembers"}
        teamUniqueId={teamId}
      />
      <TeamStatusCard
        data={datedData}
        type={"teamStats"}
        setData={setDatedData}
        enableServerButton={isDataChanged}
        updateData={handleUpdateData}
      />
    </Box>
  );
}

export default Team;

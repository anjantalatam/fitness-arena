import { db } from "./firebase-config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { get } from "lodash";

const usersCollectioRef = collection(db, "users");
const teamsCollectionRef = collection(db, "teams");
const publicCollectionRef = collection(db, "public");

export async function createUser(uid, data) {
  //data must be object
  const userDocRef = doc(usersCollectioRef, uid);
  const docResponse = await getDoc(userDocRef);

  if (docResponse.exists()) {
    return "User Already Exists. Please Login!";
  }
  setDoc(userDocRef, data);
  await incrementUsersCount();
}

export async function getPublicDocRef() {
  const countDocRef = doc(publicCollectionRef, "count");
  const docResponse = await getDoc(countDocRef);
  return { docResponse, countDocRef };
}

export async function getUsersCount() {
  const { docResponse } = await getPublicDocRef();
  return docResponse.data().value;
}

export async function incrementUsersCount() {
  const { countDocRef } = await getPublicDocRef();
  const value = await getUsersCount();
  const data = { value: value + 1 };
  setDoc(countDocRef, data);
}

export async function getDefaultTeamData() {
  const teamsDocRef = doc(teamsCollectionRef, "teamsAutoId1");
  const docData = await getDoc(teamsDocRef);

  const teamsDocData = docData.data();

  return JSON.parse(teamsDocData.defaultTeamData);
}

export async function getTeamMembersInTeam(teamDocRef) {
  const teamDocData = await getDoc(teamDocRef);
  const teamDocumentData = teamDocData.data();
  const teamMembers = get(teamDocumentData, "teamData.teamMembers", {});
  return Object.keys(teamMembers);
}

export async function getUserData(uid) {
  try {
    const userDocRef = doc(usersCollectioRef, uid);
    const docData = await getDoc(userDocRef);
    return docData.data();
  } catch (e) {
    return e;
  }
}

export async function setUsersData(uid, newData) {
  const userDocRef = doc(usersCollectioRef, uid);
  await setDoc(userDocRef, newData);
}

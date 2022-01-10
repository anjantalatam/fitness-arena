import { db } from "./firebase-config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const usersCollectioRef = collection(db, "users");
const teamsCollectionRef = collection(db, "teams");
const publicCollectionRef = collection(db, "public");

export async function createUser(uid, data) {
  //data must be object
  const userDocRef = doc(usersCollectioRef, uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return "User Already Exists. Please Login!";
  }
  setDoc(userDocRef, data);
  await incrementUsersCount();
}

export async function getUsersRef() {
  const countDocRef = doc(publicCollectionRef, "count");
  const docSnap = await getDoc(countDocRef);
  return { docSnap, countDocRef };
}

export async function getUsersCount() {
  const { docSnap } = await getUsersRef();
  return docSnap.data().value;
}

export async function incrementUsersCount() {
  const { countDocRef } = await getUsersRef();
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

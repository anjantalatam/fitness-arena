import { db } from "./firebase-config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const userCollectioRef = collection(db, "users");

export async function createUser(uid, data) {
  //data must be object
  const userDocRef = doc(db, "users", uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return "User Already Exists. Please Login!";
  }
  setDoc(userDocRef, data);
}

export async function getAllUsers() {
  // if( )
}

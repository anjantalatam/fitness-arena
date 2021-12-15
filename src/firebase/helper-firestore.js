import { db } from "./firebase-config";
import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore";

const usersCollectioRef = collection(db, "users");
const publicCollectionRef = collection(db, "public");

export async function createUser(uid, data) {
  //data must be object
  const userDocRef = doc(usersCollectioRef, uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return "User Already Exists. Please Login!";
  }
  setDoc(userDocRef, data);
}

// export async function createGymCollection(uid) {
//   const gymCollectionRef = collection(usersCollectioRef, uid, "gym");
//   const collectionSnap = await getDocs(gymCollectionRef);

//   console.log("Collection not exist", collectionSnap.docs);
//   // setDoc(collectionSnap))
// }

export async function getUsersCount() {
  const countDocRef = doc(publicCollectionRef, "count");
  const docSnap = await getDoc(countDocRef);
  return docSnap.data().value;
}

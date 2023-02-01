import { collection, DocumentData, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Movie } from "../typings";

// Retrieving current Movies List
function useList(uid: string | undefined) {
  const [list, setList] = useState<DocumentData[] | Movie[]>([]);

  // console.log(list);
  useEffect(() => {
    if (!uid) return;

    return onSnapshot(
      collection(db, "customers", uid, "myList"),
      (snapshot) => {
        setList(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );
  }, [db, uid]);

  return list;
}

export default useList;

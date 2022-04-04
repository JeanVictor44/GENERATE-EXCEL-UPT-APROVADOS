import { collection, getDocs } from "firebase/firestore"
import { Student } from "../common/types"
import { db } from "../config/firebase"

const getFirebaseDocs = async(collectionName: string) => {
    const ref = collection(db,collectionName)
    
    const snapshot = await getDocs(ref)
    console.log(snapshot)
    return snapshot.docs.map( doc => ( {...doc.data(), id:doc.id} )) as Student[]
}

export default getFirebaseDocs
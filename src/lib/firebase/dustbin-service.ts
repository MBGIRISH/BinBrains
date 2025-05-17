import { db } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, Timestamp, setDoc } from 'firebase/firestore';
import type { Dustbin } from '@/types/dustbin';

const DUSTBINS_COLLECTION = 'dustbins';
const SETTINGS_COLLECTION = 'settings';

export async function addDustbin(dustbin: Omit<Dustbin, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, DUSTBINS_COLLECTION), {
    ...dustbin,
    lastEmptied: Timestamp.fromDate(dustbin.lastEmptied),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateDustbin(id: string, data: Partial<Dustbin>): Promise<void> {
  const docRef = doc(db, DUSTBINS_COLLECTION, id);
  const updateData = { ...data };
  if (data.lastEmptied) {
    updateData.lastEmptied = Timestamp.fromDate(data.lastEmptied);
  }
  await updateDoc(docRef, updateData);
}

export async function deleteDustbin(id: string): Promise<void> {
  const docRef = doc(db, DUSTBINS_COLLECTION, id);
  await deleteDoc(docRef);
}

export async function getDustbins(): Promise<Dustbin[]> {
  const q = query(collection(db, DUSTBINS_COLLECTION), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      fillLevel: data.fillLevel,
      maxCapacity: data.maxCapacity,
      lastEmptied: data.lastEmptied.toDate(),
      isAlertActive: data.isAlertActive,
    } as Dustbin;
  });
}

export async function updateAlertThreshold(threshold: number): Promise<void> {
  const settingsRef = doc(db, SETTINGS_COLLECTION, 'alertThreshold');
  await setDoc(settingsRef, { value: threshold }, { merge: true });
}

export async function getAlertThreshold(): Promise<number> {
  const settingsRef = doc(db, SETTINGS_COLLECTION, 'alertThreshold');
  const docSnap = await getDocs(collection(db, SETTINGS_COLLECTION));
  if (docSnap.empty) {
    // Set default threshold if not exists
    await updateAlertThreshold(90);
    return 90;
  }
  const data = docSnap.docs[0].data();
  return data.value || 90;
} 
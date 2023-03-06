import { DocumentId, tDataTransformed, tFirestoreQueryItemTransformedData } from '@/types/firebase'
import { User } from 'firebase/auth'
import { addDoc, deleteDoc, DocumentData, getDoc, getDocs, query, QueryConstraint, QuerySnapshot, setDoc, WithFieldValue, DocumentReference } from 'firebase/firestore'
import { firebaseColl, firebaseDoc } from '.'
import { date2FsTimestamp } from '../mapping'

// Firestore - Add document
export const fsAdd = async <T extends any>(
  data: WithFieldValue<DocumentData>,
  path: string,
  ...pathSegments: string[]
): Promise<tDataTransformed<T> | undefined> => {
  try {
    const dataWithoutUndef: DocumentData = {}
    Object.keys(data).forEach(k => {
      dataWithoutUndef[k] = data[k] !== undefined ? data[k] : null
    })
    const docRef = await addDoc(firebaseColl(path, ...pathSegments), dataWithoutUndef)
    return await fsReadOne<T>(path, ...[...pathSegments, docRef.id])
  } catch (err) {
    throw err
  }
}
export const fsAddWithId = async <T extends any>(
  data: WithFieldValue<DocumentData>,
  id: string,
  path: string,
  ...pathSegments: string[]
): Promise<tDataTransformed<T> | undefined> => {
  try {
    const dataWithoutUndef: DocumentData = {}
    Object.keys(data).forEach(k => {
      dataWithoutUndef[k] = data[k] !== undefined ? data[k] : null
    })
    await setDoc(firebaseDoc(path, ...[...pathSegments, id]), dataWithoutUndef)
    return await fsReadOne<T>(path, ...[...pathSegments, id])
  } catch (err) {
    throw err
  }
}

export const transformData = <T extends any>(querySnapshot: QuerySnapshot<DocumentData>): Record<DocumentId, tDataTransformed<T>> => {
  const data: DocumentData = {}
  querySnapshot.forEach(snap => {
    const dataItem = snap.data() as T
    if (typeof dataItem === 'object') {
      data[snap.id] = {
        data: dataItem,
        _ref: snap.ref,
        _id: snap.id
      }
    }
  })
  return data
}
export const transformData2Arr = <T extends any>(querySnapshot: QuerySnapshot<DocumentData>): tDataTransformed<T>[] => {
  return querySnapshot.docs.map(snap => {
    const dataItem = snap.data() as T
    if (typeof dataItem === 'object') {
      return {
        data: dataItem,
        _ref: snap.ref,
        _id: snap.id
      }
    }
    return undefined
  }).filter(d => d) as tDataTransformed<T>[]
}

export const transformUserD2O = (user: User): any => ({
  email: user.email || null,
  photoURL: user.photoURL || null,
  displayName: user.displayName || 'Unnamed',
  joinedAt: date2FsTimestamp()
})
export const transformUser = (user: User): any => ({
  email: user.email || null,
  photoURL: user.photoURL || null,
  displayName: user.displayName || 'Unnamed'
})

// Firestore - Read documents
export const fsRead = async (
  path: string,
  ...pathSegments: string[]
): Promise<DocumentData> => {
  try {
    const querySnapshot = await getDocs(firebaseColl(path, ...pathSegments))
    return transformData(querySnapshot)
  } catch (err: any) {
    console.error('Error when read data from Firebase:', err.toString())
    return {}
  }
}

export const fsReadWithCond = async <Type extends object>(
  queries: QueryConstraint[],
  path: string,
  ...pathSegments: string[]
): Promise<Record<DocumentId, tDataTransformed<Type>>> => {
  try {
    const q = query(firebaseColl(path, ...pathSegments), ...queries)
    const querySnapshot = await getDocs(q)
    return transformData<Type>(querySnapshot)
  } catch (err) {
    console.error(`Error when reading [${[path, ...pathSegments].join('/')}]:`, err)
    return {}
  }
}

export const fsReadArrWithCond = async <Type extends object>(
  queries: QueryConstraint[],
  path: string,
  ...pathSegments: string[]
): Promise<tDataTransformed<Type>[]> => {
  try {
    const q = query(firebaseColl(path, ...pathSegments), ...queries)
    const querySnapshot = await getDocs(q)
    return transformData2Arr<Type>(querySnapshot)
  } catch (err) {
    console.error(`Error when reading [${[path, ...pathSegments].join('/')}]:`, err)
    return []
  }
}

export const fsReadOne = async <T extends any>(
  path: string,
  ...pathSegments: string[]
): Promise<tDataTransformed<T> | undefined> => {
  try {
    const docSnapshot = await getDoc(firebaseDoc(path, ...pathSegments))
    if (!docSnapshot.exists()) {
      return undefined
    }
    return {
      data: docSnapshot.data() as T,
      _ref: docSnapshot.ref,
      _id: docSnapshot.id
    }
  } catch (err) {
    throw err
  }
}

export const fsReadByRefs = async <T extends any>(refs: DocumentReference[]): Promise<tFirestoreQueryItemTransformedData<T>[]> => {
  try {
    const promises = refs.map(async r => {
      try {
        const d = await getDoc(r)
        if (!d.exists()) {
          return {
            isError: true,
            errorMessageId: 'notfound',
            _ref: r
          }
        }
        return {
          _ref: r,
          _id: r.id,
          data: d.data() as T
        }
      } catch (promiseErr) {
        console.error(`[path = ${r.path}]: Error when read in promises:`, promiseErr)
        return {
          isError: true,
          _ref: r,
          errorMessageId: 'unknown'
        }
      }
    })
    return await Promise.all(promises) as tFirestoreQueryItemTransformedData<T>[]
  } catch (err) {
    throw err
  }
}

// Firestore - update document
export const fsUpdate = async (
  data: DocumentData,
  path: string,
  ...pathSegments: string[]
): Promise<DocumentData | undefined> => {
  try {
    const dataWithoutUndef: DocumentData = {}
    Object.keys(data).forEach(k => {
      dataWithoutUndef[k] = data[k] !== undefined ? data[k] : null
    })
    await setDoc(firebaseDoc(path, ...pathSegments), dataWithoutUndef, {
      merge: true
    })
    return await fsReadOne(path, ...pathSegments)
  } catch (err) {
    throw err
  }
}

export const fsRemove = async (
  path: string,
  ...pathSegments: string[]
): Promise<boolean | Error> => {
  try {
    await deleteDoc(firebaseDoc(path, ...pathSegments))
    return true
  } catch (err) {
    throw err
  }
}
export const fsRemoveCol = async (path: string, ...pathSegments: string[]): Promise<(boolean | Error)[] | Error> => {
  try {
    const data = await getDocs(firebaseColl(path, ...pathSegments))
    return await Promise.all(data.docs.map(async d => await fsRemoveByRef(d.ref)))
  } catch (err) {
    throw err
  }
}

export const fsRemoveByRef = async (ref: DocumentReference): Promise<boolean | Error> => {
  try {
    await deleteDoc(ref)
    return true
  } catch (err) {
    throw err
  }
}

export const joinRefList = (root: DocumentReference[] = [], ...refs: DocumentReference[]): DocumentReference[] => {
  const current = root.map(d => d.path)
  const refsNeedJoin = refs.filter(r => !current.includes(r.path))
  return [...root, ...refsNeedJoin]
}

export const isIncludedRef = (refCheck: DocumentReference, ...listRefs: DocumentReference[][]): boolean => {
  const refPaths = listRefs.flat().map(d => d.path)
  return refPaths.includes(refCheck.path)
}
export const includedRef = (refCheck: DocumentReference, ...listRefs: DocumentReference[][]): number => {
  return listRefs.findIndex(list => list.map(l => l.path).includes(refCheck.path))
}

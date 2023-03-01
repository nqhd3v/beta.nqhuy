import { DocumentReference } from 'firebase/firestore'

export type DocumentId = DocumentReference['id'];
export type tFirestoreQueryItemData<Type> = {
  data?: Type,
  errorMessageId?: string;
  isError?: boolean;
}
export type tFirestoreQueryItemTransformedData<Type> = {
  _id?: DocumentId,
  _ref?: DocumentReference;
  data?: Type,
  errorMessageId?: string;
  isError?: boolean;
}
export type tFirestoreQueryItemsData<Type> = {
  data?: Type[],
  errorMessageId?: string;
  isError?: boolean;
}
export type tDataTransformed<Type> = { data: Type, _id: DocumentId, _ref: DocumentReference };
export type tFirestoreQueryItemsTransformedData<Type> = {
  data?: tDataTransformed<Type>[],
  errorMessageId?: string;
  isError?: boolean;
}

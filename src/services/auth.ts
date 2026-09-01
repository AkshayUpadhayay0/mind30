import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../config/firebase';
import { createUserProfile } from './firestore';

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  await updateProfile(userCredential.user, {
    displayName: name.trim(),
  });

  await createUserProfile(
    userCredential.user.uid,
    name,
    email
  );

  return userCredential.user;
};

export const loginUser = async (
  email: string,
  password: string
) => {
  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export { auth };

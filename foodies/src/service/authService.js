import { auth, googleProvider } from '../firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

export const register = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's display name
    await updateProfile(userCredential.user, {
      displayName: name
    });
    return { status: 200, data: { token: await userCredential.user.getIdToken() } };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const login = async ({ email, password }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { status: 200, data: { token: await userCredential.user.getIdToken() } };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { status: 200, data: { token: await result.user.getIdToken() } };
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { status: 200 };
  } catch (error) {
    console.error('Error logging out user:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
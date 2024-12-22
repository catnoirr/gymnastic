import { db, auth } from '@/lib/firebase'; // Assuming you're importing Firebase setup
import { getDoc, doc } from 'firebase/firestore';

export async function GET(req) {
  // Get the user's UID from the request headers (or use Firebase Authentication to get the current user)
  const user = auth.currentUser;

  if (!user) {
    return new Response(JSON.stringify({ error: 'User is not authenticated' }), { status: 401 });
  }

  try {
    // Fetch user data from the Firestore "users" collection using the UID
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      return new Response(JSON.stringify({ error: 'User data not found' }), { status: 404 });
    }

    // Return the user data
    return new Response(JSON.stringify(docSnap.data()), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

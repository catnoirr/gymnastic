// app/api/signup/route.js
import { auth, db } from '@/lib/firebase'; // Firebase setup
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return new Response(JSON.stringify({ error: 'Email, password, and name are required' }), { status: 400 });
  }

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const user = userCredential.user;
    
    // Save user data in Firestore with uid as the document ID
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
    });

    return new Response(JSON.stringify({ success: true, user: userCredential.user }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

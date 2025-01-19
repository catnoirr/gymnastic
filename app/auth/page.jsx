"use client"
import toast, { Toaster } from 'react-hot-toast';


// const function App = () => {
//   return (
//     <div>
//       <button onClick={notify}>Make me a toast</button>
//       <Toaster />
//     </div>
//   );
// };

export default function page() {

    const notify = () => toast('Here is your toast.');

  return (
    <div>
      <div>
//       <button onClick={notify}>Make me a toast</button>
//       <Toaster />
//     </div>
    </div>
  )
}

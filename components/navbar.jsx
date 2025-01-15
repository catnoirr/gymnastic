import React from "react";

export default function Navbar() {
  return (
    <div className=" h-28  flex justify-center items-center bg-[#F5F5F5]  ">
      {/* <div className='flex justify-center h-full bg-slate-400'> */}

      <ul className="flex min-w-[90%] sm:min-w-[70%] items-center justify-evenly bg-gymie-tertiary p-2 py-3 rounded-3xl ">
        <li className="text-sm cursor-pointer" >Home</li>
        <li className="text-sm cursor-pointer">Features</li>
        <li className="text-sm cursor-pointer">About</li>
        <li className="text-sm cursor-pointer" >Login</li>
      </ul>
      {/* </div> */}
    </div>
  );
}

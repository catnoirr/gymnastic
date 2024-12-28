"use client";
import AddDiet from "./components/adddiet";
import Meal from "./components/MealLogic";

export default function Navbar() {

  

  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-r from-orange-100 to-pink-50 rounded-3xl p-8" >
    <nav className="bg-white shadow-md sticky top-0 z-50 rounded-3xl">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        < h1 className="text-2xl font-bold text-orange-500 hover:scale-105 transition-transform duration-300 cursor-pointer ">
          Diet
        </h1>

        

      

        {/* Login Button */}
        <button
         
          className="hidden lg:block bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-orange-600 hover:shadow-xl transition-all duration-300"
          onClick={() => router.push('/adddiet')}
        >
          Add Diet
        </button>
      </div>

      
    </nav>
     <AddDiet />
     <Meal/>
    </div>
  );
}

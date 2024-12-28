import Sidebar from "./dashboard/components/responsiveui";
import TopBar from "./dashboard/components/topbar";

export default function DashboardLayout({ children }) {
    return (
      <div className="flex">
       
        <Sidebar />
       <div className="flex-1 ">
          {/* <TopBar /> */}
          {children}
       </div>
      
       
       
      </div>
    );
  }
  


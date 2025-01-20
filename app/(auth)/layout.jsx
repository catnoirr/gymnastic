import Sidebar from "./dashboard/components/responsiveui";
import TopBar from "./dashboard/components/topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col bg-[#FCF9F3] min-h-screen">
      
      <div className="flex md:gap-20">
      <Sidebar />
        <div className="flex-grow  p-3">{children}</div>
      </div>
    </div>
  );
}

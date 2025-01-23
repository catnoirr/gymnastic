import Sidebar from "./dashboard/components/responsiveui";
import TopBar from "./dashboard/components/topbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col  bg-gradient-to-br from-blue-300 via-indigo-300 to-purple-300 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 min-h-screen">
      
      <div className="flex md:gap-20">
      <Sidebar />
        <div className="flex-grow  p-3">{children}</div>
      </div>
    </div>
  );
}

import Sidebar from "./components/sidebar";

export default function DashboardLayout({ children }) {
    return (
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    );
  }
  


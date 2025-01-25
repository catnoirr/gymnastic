import Profile from "./components/profile";
import ProfileMenu from './components/main'
import StatsOverview from './components/stats-overview'

export default function ProfilePage() {
  // Mock user data - replace with actual user data in production
  const mockUser = {
    name: "Sagar",
    email: "offxsagr@gmail.com",
    image: "/default-avatar.png",
    stats: {
      waterStreak: 7,
      workoutStreak: 5,
      completedTasks: 28,
      totalMinutes: 840
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Top Section: Profile and Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <Profile user={mockUser} />
            </div>
            {/* Stats Overview */}
            
          </div>
          
          {/* Menu Grid */}
          <div className="mt-4">
            <ProfileMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

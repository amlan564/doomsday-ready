import { NavLink, Outlet } from "react-router-dom";

const navigation = [
  { name: "Movies", path: "/movies" },
  { name: "Rewatch Plan", path: "/rewatch-plan" },
  { name: "Booking", path: "/booking" },
];

function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <h1 className="text-xl font-bold tracking-tight text-black">
            Doomsday Ready
          </h1>

          <nav className="flex items-center gap-2">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;

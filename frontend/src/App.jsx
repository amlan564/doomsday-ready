import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import Movie from "@/pages/Movie/Movie";
import RewatchPlan from "@/pages/RewatchPlan";
import Booking from "@/pages/Booking";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/movies" replace />} />
        <Route path="/movies" element={<Movie />} />
        <Route path="/rewatch-plan" element={<RewatchPlan />} />
        <Route path="/booking" element={<Booking />} />
      </Route>

      <Route path="*" element={<Navigate to="/movies" replace />} />
    </Routes>
  );
}

export default App;

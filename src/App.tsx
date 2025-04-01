import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FocusPage from './reusable-pages/FocusPage';
import HomePage from './pages/index/+Page';
import GlobalModalList from './components/Modal/GlobalModalList';
import GlobalAlertList from './components/Alert/GlobalAlertList';
import EisenhowerMatrixPage from './reusable-pages/EisenhowerMatrixPage';
import HabitsPage from './reusable-pages/HabitsPage';
import FocusStatsPage from './reusable-pages/FocusStatsPage';
import StatsPage from './pages/StatsPage/StatsPage';
import CalendarPage from './pages/CalendarPage/CalendarPage';
import { CalendarProvider } from './contexts/useCalendarContext';
import { useSelector } from 'react-redux';
import { selectUserToken } from './slices/userSlice';

function App() {
	const isLoggedIn = useSelector(selectUserToken);

	return (
		<>
			<div className="w-[100vw] max-w-[100%] text-white text-[14px] select-none">
				{/* {isLoggedIn ? (
					<StatsProvider>
						<MainRoutes />
					</StatsProvider>
				) : (
					<MainRoutes />
				)} */}
			</div>
		</>
	);
}

const MainRoutes = () => {
	return (
		<Router>
			<Routes>
				{/* Projects */}
				<Route path="/projects/:projectId/tasks" element={<HomePage />}></Route>
				<Route path="/projects/:projectId/tasks/:taskId" element={<HomePage />}></Route>

				{/* Tags */}
				<Route path="/tags/:tagId/tasks" element={<HomePage />}></Route>
				<Route path="/tags/:tagId/tasks/:taskId" element={<HomePage />}></Route>

				{/* Filters */}
				<Route path="/filters/:filterId/tasks" element={<HomePage />}></Route>
				<Route path="/filters/:filterId/tasks/:taskId" element={<HomePage />}></Route>

				{/* Habits */}
				<Route path="/habits" element={<HabitsPage />}></Route>
				<Route path="/habits/:habitId" element={<HabitsPage />}></Route>
				<Route path="/habits/archived" element={<HabitsPage />}></Route>
				<Route path="/habits/archived/:habitId" element={<HabitsPage />}></Route>

				<Route path="/focus" element={<FocusPage />}></Route>
				<Route path="/focus-stats" element={<FocusStatsPage />}></Route>
				<Route path="/matrix" element={<EisenhowerMatrixPage />}></Route>

				{/* Statistics Page with different views */}
				<Route path="/stats/overview" element={<StatsPage />}></Route>
				<Route path="/stats/task" element={<StatsPage />}></Route>
				<Route path="/stats/focus" element={<StatsPage />}></Route>

				{/* Calendar Page */}
				<Route
					path="/calendar"
					element={
						<CalendarProvider>
							<CalendarPage />
						</CalendarProvider>
					}
				></Route>
			</Routes>

			{/* Modals */}
			<GlobalModalList />

			{/* Alerts */}
			<GlobalAlertList />
		</Router>
	);
};

export default App;

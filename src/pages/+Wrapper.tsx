import { registerSW } from 'virtual:pwa-register';
import '../index.css';
import '../App.css';
import 'material-symbols';
import { Provider } from 'react-redux';
import store from '../store/store';
import App from '../App';
import { StatsProvider } from '../contexts/useStatsContext';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import GlobalAlertList from '../components/Alert/GlobalAlertList';
import GlobalModalList from '../components/Modal/GlobalModalList';
import { isFromServer } from '../utils/helpers.utils';
import { usePageContext } from 'vike-react/usePageContext';

const Wrapper = ({ children }) => {
	const pageContext = usePageContext();
	const currLocation = pageContext.urlParsed.pathname;

	return (
		<Provider store={store}>
			<StatsProvider>
				{isFromServer() ? (
					<StaticRouter basename="/" location={currLocation}>
						<RouterChildren>{children}</RouterChildren>
					</StaticRouter>
				) : (
					<Router>
						<RouterChildren>{children}</RouterChildren>
					</Router>
				)}
			</StatsProvider>
		</Provider>
	);
};

const RouterChildren = ({ children }) => {
	return (
		<>
			<Routes>
				{/* Projects */}

				{/* <Route path="/projects/:projectId/tasks" element={<HomePage />}></Route>
							<Route path="/projects/:projectId/tasks/:taskId" element={<HomePage />}></Route> */}

				{/* Tags */}
				{/* <Route path="/tags/:tagId/tasks" element={<HomePage />}></Route>
							<Route path="/tags/:tagId/tasks/:taskId" element={<HomePage />}></Route> */}

				{/* Filters */}
				{/* <Route path="/filters/:filterId/tasks" element={<HomePage />}></Route>
							<Route path="/filters/:filterId/tasks/:taskId" element={<HomePage />}></Route> */}

				{/* Habits */}
				{/* <Route path="/habits" element={<HabitsPage />}></Route>
							<Route path="/habits/:habitId" element={<HabitsPage />}></Route>
							<Route path="/habits/archived" element={<HabitsPage />}></Route>
							<Route path="/habits/archived/:habitId" element={<HabitsPage />}></Route> */}

				{/* <Route path="/focus" element={<FocusPage />}></Route>
							<Route path="/focus-stats" element={<FocusStatsPage />}></Route>
							<Route path="/matrix" element={<EisenhowerMatrixPage />}></Route> */}

				{/* Statistics Page with different views */}
				{/* <Route path="/stats/overview" element={<StatsPage />}></Route>
							<Route path="/stats/task" element={<StatsPage />}></Route>
							<Route path="/stats/focus" element={<StatsPage />}></Route> */}

				{/* Calendar Page */}
				{/* <Route
								path="/calendar"
								element={
									<CalendarProvider>
										<CalendarPage />
									</CalendarProvider>
								}
							></Route> */}
			</Routes>

			{/* Modals */}
			<GlobalModalList />

			{/* Alerts */}
			<GlobalAlertList />

			{children}
		</>
	);
};

registerSW();

export default Wrapper;

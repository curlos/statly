import '../index.css';
import '../App.css';
import 'material-symbols';

import { registerSW } from 'virtual:pwa-register';
import { Provider } from 'react-redux';
import store from '../store/store';
import { StatsProvider } from '../contexts/useStatsContext';
import { BrowserRouter as Router, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import GlobalAlertList from '../components/Alert/GlobalAlertList';
import GlobalModalList from '../components/Modal/GlobalModalList';
import { isFromServer } from '../utils/helpers.utils';
import { usePageContext } from 'vike-react/usePageContext';

export const Wrapper = ({ children }) => {
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

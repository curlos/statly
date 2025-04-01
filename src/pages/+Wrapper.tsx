import '../index.css';
import '../App.css';
import 'material-symbols';

import { registerSW } from 'virtual:pwa-register';
import { Provider, useSelector } from 'react-redux';
import store from '../store/store';
import { StatsProvider } from '../contexts/useStatsContext';
import GlobalAlertList from '../components/Alert/GlobalAlertList';
import GlobalModalList from '../components/Modal/GlobalModalList';
import { ThemeProvider } from '../contexts/useThemeContext';
import { SearchParamsProvider } from '../contexts/useSearchParamsContext';
import { UserSettingsProvider } from './ticktick-1.00/focus-records/useUserSettingsContext';
import { usePageContext } from 'vike-react/usePageContext';
import { selectUserToken } from '../slices/userSlice';
import { navigate } from 'vike/client/router';

export const Wrapper = ({ children }) => {
	return (
		<Provider store={store}>
			<ProviderList>{children}</ProviderList>
		</Provider>
	);
};

const ProviderList = ({ children }) => {
	const pageContext = usePageContext();
	const pageRoute = pageContext?.urlParsed?.pathname;
	const isLoggedIn = useSelector(selectUserToken);

	const isNotOnLoginPage = pageRoute !== '/login';

	if (!isLoggedIn && isNotOnLoginPage) {
		navigate('/login');
	}

	if (!isLoggedIn) {
		return (
			<div className="text-white select-none">
				{children}

				{/* Modals */}
				<GlobalModalList />

				{/* Alerts */}
				<GlobalAlertList />
			</div>
		);
	}

	return (
		<SearchParamsProvider>
			<ThemeProvider>
				<UserSettingsProvider>
					<StatsProvider>
						<div className="text-white select-none">
							{children}

							{/* Modals */}
							<GlobalModalList />

							{/* Alerts */}
							<GlobalAlertList />
						</div>
					</StatsProvider>
				</UserSettingsProvider>
			</ThemeProvider>
		</SearchParamsProvider>
	);
};

registerSW();

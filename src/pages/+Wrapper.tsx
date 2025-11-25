import '../index.css';
import '../App.css';
import '../fonts';
import 'material-symbols';

import { Provider, useSelector } from 'react-redux';
import store from '../store/store';
// import { StatsProvider } from '../contexts/useStatsContext';
import GlobalModalList from '../components/Modal/GlobalModalList';
import { ThemeProvider, useThemeContext } from '../contexts/useThemeContext';
import { SearchParamsProvider } from '../contexts/useSearchParamsContext';
import { UserSettingsProvider } from './focus-records/useUserSettingsContext';
import { usePageContext } from 'vike-react/usePageContext';
import { selectUserToken } from '../slices/userSlice';
import { navigate } from 'vike/client/router';
import { useAutoSync } from '../hooks/useAutoSync';
import { FontLoadingProvider } from '../contexts/useFontLoadingContext';

const globalClasses = 'text-white select-none';

export const Wrapper = ({ children }) => {
	return (
		<Provider store={store}>
			<FontLoadingProvider>
				<ProviderList>{children}</ProviderList>
			</FontLoadingProvider>
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
			<div className={globalClasses}>
				{children}

				{/* Modals */}
				<GlobalModalList />
			</div>
		);
	}

	return (
		<SearchParamsProvider>
			<ThemeProvider>
				<UserSettingsProvider>
					<LoggedInBase children={children} />
				</UserSettingsProvider>
			</ThemeProvider>
		</SearchParamsProvider>
	);
};

const LoggedInBase = ({ children }) => {
	const themeContext = useThemeContext();
	const { selectedFontFamilyKey } = themeContext;

	// useAutoSync();

	const globalStyle = {
		fontFamily: selectedFontFamilyKey !== 'Default' ? selectedFontFamilyKey : '',
	};

	return (
		<div className={globalClasses} style={globalStyle}>
			{children}

			{/* Modals */}
			<GlobalModalList />
		</div>
	);
};

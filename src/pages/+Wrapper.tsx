import '../index.css';
import '../App.css';
import '../fonts';
import 'material-symbols';

import { Provider, useSelector, useDispatch } from 'react-redux';
import store from '../store/store';
import GlobalModalList from '../components/Modal/GlobalModalList';
import { ThemeProvider, useThemeContext } from '../contexts/useThemeContext';
import { SearchParamsProvider } from '../contexts/useSearchParamsContext';
import { UserSettingsProvider } from './focus-records/useUserSettingsContext';
import { usePageContext } from 'vike-react/usePageContext';
import { selectUserToken, loginUserSuccess } from '../slices/userSlice';
import { navigate } from 'vike/client/router';
import { useAutoSync } from '../hooks/useAutoSync';
import { FontLoadingProvider } from '../contexts/useFontLoadingContext';
import { useGetLoggedInUserQuery } from '../services/resources/usersApi';
import { useEffect } from 'react';

const globalClasses = 'text-white select-none';

interface WrapperProps {
	children: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
	return (
		<Provider store={store}>
			<FontLoadingProvider>
				<ProviderList>{children}</ProviderList>
			</FontLoadingProvider>
		</Provider>
	);
};

interface ProviderListProps {
	children: React.ReactNode;
}

const ProviderList: React.FC<ProviderListProps> = ({ children }) => {
	const pageContext = usePageContext();
	const pageRoute = pageContext?.urlParsed?.pathname;
	const isLoggedIn = useSelector(selectUserToken);
	const dispatch = useDispatch();

	// Fetch user data if token exists but user data is not loaded
	const { data: userData } = useGetLoggedInUserQuery();

	useEffect(() => {
		if (userData && isLoggedIn) {
			dispatch(loginUserSuccess({ user: userData, token: isLoggedIn }));
		}
	}, [userData, isLoggedIn, dispatch]);

	const isOnLoginOrSignupPage = pageRoute === '/login' || pageRoute === '/signup';

	if (!isLoggedIn) {
		// If not on login/signup page, navigate there
		if (!isOnLoginOrSignupPage) {
			navigate('/login');
			// Keep rendering with providers during transition to prevent context errors
			// Fall through to the main return at the bottom
		} else {
			// On login/signup page: render without providers
			return (
				<ThemeProvider>
					<div className={globalClasses}>
						{children}

						{/* Modals */}
						<GlobalModalList isAuthPage={true} />
					</div>
				</ThemeProvider>
			);
		}
	}

	// Logged in OR transitioning to login: render with all providers
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

interface LoggedInBaseProps {
	children: React.ReactNode;
}

const LoggedInBase: React.FC<LoggedInBaseProps> = ({ children }) => {
	const themeContext = useThemeContext();
	const { selectedFontFamilyKey } = themeContext;

	useAutoSync();

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

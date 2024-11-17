import '../index.css';
import '../App.css';
import 'material-symbols';

// import { registerSW } from 'virtual:pwa-register';
import { Provider } from 'react-redux';
import store from '../store/store';
import { StatsProvider } from '../contexts/useStatsContext';
import GlobalAlertList from '../components/Alert/GlobalAlertList';
import GlobalModalList from '../components/Modal/GlobalModalList';
import { ThemeProvider } from '../contexts/useThemeContext';
import { SearchParamsProvider } from '../contexts/useSearchParamsContext';
import { UserSettingsProvider } from './ticktick-1.00/focus-records/useUserSettingsContext';

export const Wrapper = ({ children }) => (
	<Provider store={store}>
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
	</Provider>
);

// registerSW();

import '../index.css';
import '../App.css';
import 'material-symbols';

// import { registerSW } from 'virtual:pwa-register';
import { Provider } from 'react-redux';
import store from '../store/store';
import { StatsProvider } from '../contexts/useStatsContext';
import GlobalAlertList from '../components/Alert/GlobalAlertList';
import GlobalModalList from '../components/Modal/GlobalModalList';
import { ThemeProvider } from './ticktick-1.00/focus-records/useThemeContext';
import { SearchParamsProvider } from '../hooks/useSearchParamsCustom';

export const Wrapper = ({ children }) => (
	<Provider store={store}>
		<SearchParamsProvider>
			<ThemeProvider>
				<StatsProvider>
					<div className="text-white select-none">
						{children}

						{/* Modals */}
						<GlobalModalList />

						{/* Alerts */}
						<GlobalAlertList />
					</div>
				</StatsProvider>
			</ThemeProvider>
		</SearchParamsProvider>
	</Provider>
);

// registerSW();

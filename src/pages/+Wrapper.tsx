import '../index.css';
import '../App.css';
import 'material-symbols';

import { registerSW } from 'virtual:pwa-register';
import { Provider } from 'react-redux';
import store from '../store/store';
import { StatsProvider } from '../contexts/useStatsContext';
import GlobalAlertList from '../components/Alert/GlobalAlertList';
import GlobalModalList from '../components/Modal/GlobalModalList';

export const Wrapper = ({ children }) => (
	<Provider store={store}>
		<StatsProvider>
			{children}

			{/* Modals */}
			<GlobalModalList />

			{/* Alerts */}
			<GlobalAlertList />
		</StatsProvider>
	</Provider>
);

registerSW();

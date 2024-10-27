import { registerSW } from 'virtual:pwa-register';
import '../index.css';
import '../App.css';
import 'material-symbols';
import { Provider } from 'react-redux';
import store from '../store/store';
import App from '../App';

const Wrapper = () => {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};

registerSW();

export default Wrapper;

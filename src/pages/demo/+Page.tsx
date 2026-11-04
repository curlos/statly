import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { navigate } from 'vike/client/router';
import { useLoginAsGuestMutation } from '../../services/resources/usersApi';
import { selectUserToken } from '../../slices/userSlice';
import Spinner from '../../components/Loaders/Spinner';

// A link that can be shared to put someone straight into guest mode. Anyone already logged in just stays logged in.
const Page = () => {
	const token = useSelector(selectUserToken);
	const [loginAsGuest] = useLoginAsGuestMutation();

	useEffect(() => {
		const enterDemo = async () => {
			try {
				if (!token) {
					await loginAsGuest().unwrap();
				}
				navigate('/stats/overview');
			} catch {
				navigate('/login');
			}
		};

		enterDemo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div role="status" className="min-h-screen flex items-center justify-center gap-3">
			<Spinner />
			<span>Loading the demo…</span>
		</div>
	);
};

export default Page;

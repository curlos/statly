import { useEffect } from 'react';
import UserForm from '../../components/UserForm';
import { selectUserToken } from '../../slices/userSlice';
import { useSelector } from 'react-redux';
import { navigate } from 'vike/client/router';
import { usePageContext } from 'vike-react/usePageContext';

const LoginAndSignupPage = () => {
	const isLoggedIn = useSelector(selectUserToken);

	const pageContext = usePageContext();

	useEffect(() => {
		if (isLoggedIn) {
			navigate('/ticktick-1.00/focus-records');
		}
	}, []);

	// Determine the mode based on the pathname
	const isSignupRoute = pageContext?.urlParsed?.pathname?.includes('/signup');
	const mode = isSignupRoute ? 'register' : 'login';

	return (
		<div className="flex justify-center items-center min-h-screen bg-color-gray-700">
			<div className="container flex flex-col items-center">
				<img src="/helicopter-medal-cod-mwr.webp" alt="" className="w-[120px] h-[120px] mb-5" />
				<UserForm mode={mode} />
			</div>
		</div>
	);
};

export default LoginAndSignupPage;

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
			navigate('/focus-records');
		}
	}, []);

	// Determine the mode based on the pathname
	const isSignupRoute = pageContext?.urlParsed?.pathname?.includes('/signup');
	const mode = isSignupRoute ? 'register' : 'login';

	return (
		<div className="flex justify-center items-center min-h-screen bg-color-gray-700">
			<div className="container flex flex-col items-center">
				<UserForm mode={mode} />
			</div>
		</div>
	);
};

export default LoginAndSignupPage;

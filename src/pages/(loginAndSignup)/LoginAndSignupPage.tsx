import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
			navigate('/projects/all/tasks');
		}
	}, []);

	// Determine the mode based on the pathname
	const isSignupRoute = pageContext.urlParsed.pathname.includes('/signup');
	const mode = isSignupRoute ? 'register' : 'login';

	return (
		<div className="flex justify-center items-center min-h-screen bg-color-gray-700">
			<div className="flex flex-col items-center">
				<img src="/Overflowing_Cup.webp" alt="" className="w-[100px] h-[100px] mb-[50px]" />
				<UserForm mode={mode} />
			</div>
		</div>
	);
};

export default LoginAndSignupPage;

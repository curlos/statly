import { useEffect } from 'react';
import UserForm from '../../components/UserForm';
import Link from '../../components/Link';
import Icon from '../../components/Icon';
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
	}, [isLoggedIn]);

	// Determine the mode based on the pathname
	const isSignupRoute = pageContext?.urlParsed?.pathname?.includes('/signup');
	const mode = isSignupRoute ? 'register' : 'login';

	return (
		<main id="main-content" tabIndex={-1} className="flex flex-col min-h-screen bg-color-gray-700 outline-none">
			{/* Sits above the form on phones and in the top right corner on bigger screens */}
			<div className="flex flex-col items-center gap-1 p-4 sm:absolute sm:top-0 sm:right-0 sm:items-end">
				<Link
					href="/demo"
					className="flex items-center gap-1 rounded-xl px-4 py-2 font-semibold bg-emerald-600 hover:bg-emerald-700 text-[#ffffff] transition-colors"
				>
					<span>Try the Live Demo</span>
					<Icon name="arrow_forward" customClass="!text-[18px]" />
				</Link>
				<span className="text-[14px] text-color-gray-50 sm:pr-1">No signup needed</span>
			</div>

			<div className="flex-1 flex justify-center items-center">
				<div className="container flex flex-col items-center">
					<UserForm mode={mode} />
				</div>
			</div>
		</main>
	);
};

export default LoginAndSignupPage;

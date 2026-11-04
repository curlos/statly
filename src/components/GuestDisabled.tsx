import { useSelector } from 'react-redux';
import { selectIsGuest } from '../slices/userSlice';

interface GuestDisabledProps {
	children: React.ReactNode;
}

// Keeps a control visible but faded and unusable for guests. It changes nothing for everyone else. Everything inside ignores the mouse so this is what the mouse is over, which is how hovering shows why it's turned off (see GuestTooltip).
const GuestDisabled: React.FC<GuestDisabledProps> = ({ children }) => {
	const isGuest = useSelector(selectIsGuest);

	if (!isGuest) {
		return <>{children}</>;
	}

	return (
		<fieldset disabled data-guest-disabled className="min-w-0 m-0 p-0 border-0 opacity-50 cursor-not-allowed [&_*]:pointer-events-none">
			{children}
		</fieldset>
	);
};

export default GuestDisabled;

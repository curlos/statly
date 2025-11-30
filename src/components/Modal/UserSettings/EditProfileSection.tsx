import { useState } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import ProfileTabSection from './ProfileTabSection';
import PasswordTabSection from './PasswordTabSection';

const EditProfileSection = () => {
	const { chosenColorObj } = useThemeContext();
	const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

	const handleSuccess = (message: string) => {
		setSubmitSuccess(message);
		setSubmitError(null);
	};

	const handleError = (message: string) => {
		setSubmitError(message);
		setSubmitSuccess(null);
	};

	const themeColor = chosenColorObj?.hexColor || '#3b82f6';
	const sharedButtonStyle = 'text-[14px] py-1 px-3 rounded-3xl cursor-pointer';
	const selectedButtonStyle = `${sharedButtonStyle} font-bold`;
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-300`;

	return (
		<div>
			{/* Tabs */}
			<div className="flex justify-center gap-2 mb-6">
				<div
					className={activeTab === 'profile' ? selectedButtonStyle : unselectedButtonStyle}
					style={activeTab === 'profile' ? { backgroundColor: `${themeColor}33`, color: themeColor } : {}}
					onClick={() => { setActiveTab('profile'); setSubmitError(null); setSubmitSuccess(null); }}
				>
					Profile
				</div>
				<div
					className={activeTab === 'password' ? selectedButtonStyle : unselectedButtonStyle}
					style={activeTab === 'password' ? { backgroundColor: `${themeColor}33`, color: themeColor } : {}}
					onClick={() => { setActiveTab('password'); setSubmitError(null); setSubmitSuccess(null); }}
				>
					Password
				</div>
			</div>

			{/* Tab Content */}
			{activeTab === 'profile' && (
				<ProfileTabSection
					onSuccess={handleSuccess}
					onError={handleError}
					submitError={submitError}
					submitSuccess={submitSuccess}
				/>
			)}

			{activeTab === 'password' && (
				<PasswordTabSection
					onSuccess={handleSuccess}
					onError={handleError}
					submitError={submitError}
					submitSuccess={submitSuccess}
				/>
			)}
		</div>
	);
};

export default EditProfileSection;

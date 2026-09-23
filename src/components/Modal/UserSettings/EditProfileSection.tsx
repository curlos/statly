import { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { useThemeContext } from '../../../contexts/useThemeContext';
import ProfileTabSection from './ProfileTabSection';
import PasswordTabSection from './PasswordTabSection';

const EditProfileSection = () => {
	const { chosenColorObj } = useThemeContext();
	const { bgColor } = chosenColorObj;
	const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
	const profileTabRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		profileTabRef.current?.focus();
	}, []);
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

	const sharedButtonStyle = 'text-[14px] py-1 px-3 rounded-3xl cursor-pointer';
	const selectedButtonStyle = classNames(bgColor, `${sharedButtonStyle} font-bold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-25 bg-color-gray-300`;

	return (
		<div>
			{/* Tabs */}
			<div role="tablist" aria-label="Edit profile sections" className="flex justify-center gap-2 mb-6">
				<button
					ref={profileTabRef}
					role="tab"
					id="edit-profile-tab"
					aria-selected={activeTab === 'profile'}
					aria-controls="edit-tab-panel"
					className={activeTab === 'profile' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => {
						setActiveTab('profile');
						setSubmitError(null);
						setSubmitSuccess(null);
					}}
				>
					Profile
				</button>
				<button
					role="tab"
					id="edit-password-tab"
					aria-selected={activeTab === 'password'}
					aria-controls="edit-tab-panel"
					className={activeTab === 'password' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => {
						setActiveTab('password');
						setSubmitError(null);
						setSubmitSuccess(null);
					}}
				>
					Password
				</button>
			</div>

			{/* Tab Content */}
			<div
				id="edit-tab-panel"
				role="tabpanel"
				aria-labelledby={activeTab === 'profile' ? 'edit-profile-tab' : 'edit-password-tab'}
			>
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
		</div>
	);
};

export default EditProfileSection;

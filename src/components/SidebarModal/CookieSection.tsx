import { useState } from 'react';
import Icon from '../Icon';
import { useGetUserSettingsQuery, useEditUserSettingsMutation } from '../../services/resources/userSettingsApi';
import { useThemeContext } from '../../contexts/useThemeContext';
import Spinner from '../Loaders/Spinner';

const CookieSection = () => {
	const { data: fetchedUserSettings } = useGetUserSettingsQuery(undefined);
	const { userSettings } = fetchedUserSettings || {};
	const [editUserSettings, { isLoading: isUpdatingCookie }] = useEditUserSettingsMutation();
	const themeContext = useThemeContext();
	const chosenColorObj = themeContext?.chosenColorObj;
	const themeColor = chosenColorObj?.hexColor || '#3b82f6';

	const [isEditingCookie, setIsEditingCookie] = useState(false);
	const [cookieValue, setCookieValue] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const hasCookie = userSettings?.tickTickCookieSet || false;

	const handleUpdateCookie = async () => {
		try {
			setErrorMessage('');
			setSuccessMessage('');
			await editUserSettings({ tickTickCookie: cookieValue }).unwrap();
			setIsEditingCookie(false);
			setCookieValue('');
			setSuccessMessage('Cookie updated successfully!');
			setTimeout(() => setSuccessMessage(''), 1500);
		} catch (error: unknown) {
			const errorMessage = error && typeof error === 'object' && 'data' in error
				? (error.data as { message?: string })?.message || 'Failed to update cookie'
				: 'Failed to update cookie';
			setErrorMessage(errorMessage);
			setTimeout(() => setErrorMessage(''), 5000);
		}
	};

	const handleCancelEdit = () => {
		setIsEditingCookie(false);
		setCookieValue('');
		setErrorMessage('');
	};

	return (
		<div className="mt-4 space-y-2">
			<label className="text-sm font-semibold text-color-gray-25">TickTick Cookie</label>

			{!isEditingCookie ? (
				<button
					type="button"
					aria-label={hasCookie ? 'Edit TickTick cookie' : 'Configure TickTick cookie'}
					className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-color-gray-600 rounded"
					onClick={() => setIsEditingCookie(true)}
				>
					<div className="flex items-center gap-2">
						{hasCookie ? (
							<>
								<Icon name="check_circle" fill={1} customClass="!text-[16px] text-green-400" />
								<span className="text-sm text-white">Cookie configured</span>
							</>
						) : (
							<>
								<Icon name="warning" fill={1} customClass="!text-[16px] text-yellow-400" />
								<span className="text-sm text-color-gray-100">No cookie set</span>
							</>
						)}
					</div>
					<Icon
						name={hasCookie ? 'edit' : 'add'}
						fill={1}
						customClass="!text-[18px] p-2 bg-color-gray-500 hover:bg-color-gray-200 rounded transition-colors"
					/>
				</button>
			) : (
				<div className="flex gap-2">
					<input
						type="text"
						value={cookieValue}
						onChange={(e) => setCookieValue(e.target.value)}
						className="flex-1 px-3 py-2 rounded bg-color-gray-600 text-white text-sm border border-blue-400"
						placeholder="Paste your TickTick cookie here"
						autoFocus
					/>

					<button
						onClick={handleCancelEdit}
						className="p-2 bg-color-gray-600 hover:bg-color-gray-500 rounded transition-colors"
						title="Cancel"
					>
						<Icon name="close" fill={1} customClass="!text-[18px]" />
					</button>
				</div>
			)}

			{isEditingCookie && (
				<button
					onClick={handleUpdateCookie}
					disabled={isUpdatingCookie}
					className="w-full px-4 py-2 rounded text-white font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					style={{
						backgroundColor: themeColor,
					}}
				>
					{isUpdatingCookie ? (
						<>
							<span>Updating...</span>
							<Spinner size="sm" customClass="!text-white" />
						</>
					) : (
						'Update TickTick Cookie'
					)}
				</button>
			)}

			<div aria-live="polite" aria-atomic="true">
				{successMessage && (
					<div className="flex items-center gap-2 p-2 bg-green-500/20 border border-green-500 rounded text-green-400 text-sm">
						<Icon name="check_circle" fill={1} customClass="!text-[16px]" />
						{successMessage}
					</div>
				)}
				{errorMessage && (
					<div className="flex items-center gap-2 p-2 bg-red-500/20 border border-red-500 rounded text-red-400 text-sm">
						<Icon name="error" fill={1} customClass="!text-[16px]" />
						{errorMessage}
					</div>
				)}
			</div>
		</div>
	);
};

export default CookieSection;

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../slices/userSlice';
import { useUpdateUserProfileMutation } from '../../../services/resources/usersApi';
import FormInput from '../../FormInput';
import Icon from '../../Icon';
import Tooltip from '../../Tooltip';
import Spinner from '../../Loaders/Spinner';
import { useThemeContext } from '../../../contexts/useThemeContext';
import ImageCropModal from '../ImageCropModal';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ProfileTabSectionProps {
	onSuccess: (message: string) => void;
	onError: (message: string) => void;
	submitError: string | null;
	submitSuccess: string | null;
}

const ProfileTabSection: React.FC<ProfileTabSectionProps> = ({ onSuccess, onError, submitError, submitSuccess }) => {
	const user = useSelector(selectUser);
	const { chosenColorObj } = useThemeContext();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [showCropModal, setShowCropModal] = useState(false);
	const [imageToCrop, setImageToCrop] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: user?.name || '',
			email: user?.email || '',
			currentPassword: '',
		}
	});

	const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

	const handleProfilePicClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				onError('Image size must be less than 5MB');
				return;
			}
			const reader = new FileReader();
			reader.onloadend = () => {
				setImageToCrop(reader.result as string);
				setShowCropModal(true);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCropComplete = async (croppedImageUrl: string) => {
		try {
			// Convert data URL to File object
			const response = await fetch(croppedImageUrl);
			const blob = await response.blob();
			const file = new File([blob], 'profile-pic.jpg', { type: 'image/jpeg' });

			// Set both preview and file
			setPreviewImage(croppedImageUrl);
			setSelectedFile(file);

			setShowCropModal(false);
			// Reset file input
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		} catch (error) {
			console.error('Error processing cropped image:', error);
			onError('Failed to process cropped image');
		}
	};

	const handleCropModalClose = () => {
		setShowCropModal(false);
		setImageToCrop(null);
		// Reset file input when user cancels
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const onSubmit = async (data: { name: string; email: string; currentPassword: string }) => {
		try {
			onError('');

			// Check if anything has actually changed
			const nameChanged = data.name.trim() !== user?.name;
			const emailChanged = data.email !== user?.email;
			const profilePicChanged = selectedFile !== null;

			if (!nameChanged && !emailChanged && !profilePicChanged) {
				onError('No changes to save');
				return;
			}

			const formData = new FormData();
			formData.append('name', data.name);

			// Only include email and password if email has changed
			if (emailChanged) {
				formData.append('email', data.email);
				formData.append('currentPassword', data.currentPassword);
			}

			if (profilePicChanged) {
				formData.append('profilePic', selectedFile);
			}

			await updateProfile(formData).unwrap();
			onSuccess('Profile updated successfully!');
			reset({ name: data.name, email: data.email, currentPassword: '' });
			setSelectedFile(null);
			setPreviewImage(null);
		} catch (error: unknown) {
			const err = error as { data?: { message?: string }; message?: string };
			onError(err?.data?.message || err?.message || 'Failed to update profile');
		}
	};

	const themeColor = chosenColorObj?.hexColor || '#3b82f6';

	const getInitials = (name: string) => {
		return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
	};

	const displayImage = previewImage || user?.profilePic || null;

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
			{/* Profile Picture */}
			<div className="flex flex-col items-center mb-6">
				<div className="relative mb-2 cursor-pointer" onClick={handleProfilePicClick}>
					{displayImage ? (
						<img
							src={displayImage}
							alt="Profile"
							className="w-24 h-24 rounded-full object-cover"
						/>
					) : (
						<div
							className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl"
							style={{ backgroundColor: themeColor }}
						>
							{getInitials(user?.name || 'U')}
						</div>
					)}
					{/* Gray overlay - always visible */}
					<div className="absolute inset-0 bg-black bg-opacity-60 rounded-full flex items-center justify-center hover:bg-opacity-50 transition">
						<Icon name="camera_alt" fill={0} customClass="!text-[24px] text-white" />
					</div>
				</div>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileChange}
					className="hidden"
				/>
			</div>

			<div className="flex flex-col gap-4">
				<FormInput
					id="name"
					type="text"
					placeholder="Name"
					iconName="person"
					register={register('name', {
						required: 'Name is required',
						validate: (value: string) => {
							const trimmed = value?.trim();
							if (!trimmed || trimmed.length === 0) return 'Name cannot be empty';
							return true;
						}
					})}
					error={errors.name}
				/>

				{/* Email input with tooltip */}
				<div>
					<div className="flex items-center gap-2 bg-color-gray-200 rounded-xl p-2">
						<Icon name="email" customClass="!text-[20px]" />
						<input
							id="email"
							type="email"
							placeholder="Email"
							{...register('email', {
								required: 'Email is required',
								pattern: { value: EMAIL_REGEX, message: 'Please enter a valid email address' }
							})}
							className="w-full text-[16px] p-1 bg-transparent placeholder:text-color-gray-100 mb-0 resize-none outline-none rounded"
						/>
						<Tooltip
							content="Changing your email requires your current password for security."
							position="bottom"
							className="w-64"
						>
							<Icon
								name="help"
								customClass="!text-[20px] text-color-gray-100 cursor-pointer"
							/>
						</Tooltip>
					</div>
					{errors.email && <p className="text-red-500 mt-1">{errors.email?.message as string}</p>}
				</div>

				{/* Indented current password field */}
				<div className="ml-6">
					<FormInput
						id="currentPasswordProfile"
						type="password"
						placeholder="Current Password (required for email change)"
						iconName="lock"
						register={register('currentPassword')}
						error={errors.currentPassword}
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full rounded-xl p-2 mt-2 flex items-center justify-center gap-2"
					style={{ backgroundColor: themeColor }}
				>
					<span>Update Profile</span>
					{isLoading && <Spinner size="sm" customClass="!text-white" />}
				</button>

				{/* Error/Success Messages */}
				{submitError && (
					<div className="bg-red-500/10 border border-red-500 text-red-500 rounded-xl p-3 text-sm">
						{submitError}
					</div>
				)}

				{submitSuccess && (
					<div className="bg-green-500/10 border border-green-500 text-green-500 rounded-xl p-3 text-sm">
						{submitSuccess}
					</div>
				)}
			</div>

			<ImageCropModal
				isOpen={showCropModal}
				onClose={handleCropModalClose}
				imageSrc={imageToCrop || ''}
				onCropComplete={handleCropComplete}
				aspect={1}
			/>
		</form>
	);
};

export default ProfileTabSection;

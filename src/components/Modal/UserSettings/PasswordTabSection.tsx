import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateUserPasswordMutation } from '../../../services/resources/usersApi';
import FormInput from '../../FormInput';
import Spinner from '../../Loaders/Spinner';
import { useThemeContext } from '../../../contexts/useThemeContext';

const passwordValidation = {
	minLength: { value: 8, message: 'Password must be at least 8 characters long' },
	validate: (value: string) => {
		if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
		if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
		if (!/\d/.test(value)) return 'Password must contain at least one number';
		if (!/[@$!%*?&]/.test(value)) return 'Password must contain at least one special character (@$!%*?&)';
		return true;
	}
};

interface PasswordFormData {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}

interface PasswordTabSectionProps {
	onSuccess: (message: string) => void;
	onError: (message: string) => void;
	submitError: string | null;
	submitSuccess: string | null;
}

const PasswordTabSection: React.FC<PasswordTabSectionProps> = ({ onSuccess, onError, submitError, submitSuccess }) => {
	const { chosenColorObj } = useThemeContext();
	const serverErrorRef = useRef<HTMLDivElement>(null);
	const successRef = useRef<HTMLDivElement>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<PasswordFormData>();

	const [updatePassword, { isLoading }] = useUpdateUserPasswordMutation();

	const onSubmit = async (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
		try {
			onError('');

			if (data.newPassword !== data.confirmPassword) {
				onError('Passwords do not match');
				return;
			}

			if (data.newPassword === data.currentPassword) {
				onError('New password must be different from current password');
				return;
			}

			await updatePassword({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			}).unwrap();

			onSuccess('Password updated successfully!');
			reset();
		} catch (error: unknown) {
			const err = error as { data?: { message?: string }; message?: string };
			onError(err?.data?.message || err?.message || 'Failed to update password');
		}
	};

	const themeColor = chosenColorObj?.hexColor || '#3b82f6';

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
			<div className="flex flex-col gap-4">
				<FormInput
					id="currentPasswordChange"
					type="password"
					placeholder="Current Password"
					iconName="lock"
					register={register('currentPassword', { required: 'Current password is required' })}
					error={errors.currentPassword}
				/>

				<FormInput
					id="newPassword"
					type="password"
					placeholder="New Password"
					iconName="lock"
					register={register('newPassword', {
						required: 'New password is required',
						...passwordValidation
					})}
					error={errors.newPassword}
				/>

				<FormInput
					id="confirmPassword"
					type="password"
					placeholder="Confirm New Password"
					iconName="lock"
					register={register('confirmPassword', { required: 'Please confirm your password' })}
					error={errors.confirmPassword}
				/>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full rounded-xl p-2 mt-2 flex items-center justify-center gap-2"
					style={{ backgroundColor: themeColor }}
				>
					<span>Update Password</span>
					{isLoading && <Spinner size="sm" customClass="!text-white" />}
				</button>

				{/* Server error / success messages */}
				<div
					ref={serverErrorRef}
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
					className={submitError ? 'bg-red-500/10 border border-red-500 text-red-500 rounded-xl p-3 text-sm' : 'sr-only'}
				>
					{submitError ?? ''}
				</div>

				<div
					ref={successRef}
					role="status"
					aria-live="polite"
					aria-atomic="true"
					className={submitSuccess ? 'bg-green-500/10 border border-green-500 text-green-500 rounded-xl p-3 text-sm' : 'sr-only'}
				>
					{submitSuccess ?? ''}
				</div>
			</div>
		</form>
	);
};

export default PasswordTabSection;

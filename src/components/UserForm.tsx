import { useForm } from 'react-hook-form';
import { useLoginUserMutation, useRegisterUserMutation } from '../services/resources/usersApi';
import { navigate } from 'vike/client/router';
import Link from './Link';
import classNames from 'classnames';
import { TAILWIND_COLORS_OBJ } from '../utils/TAILWIND_COLORS/TAILWIND_COLORS_OBJ';
import { useState } from 'react';
import FormInput from './FormInput';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation rules for signup (strict validation)
const signupValidationRules = {
	name: {
		required: 'Name is required',
		validate: (value: string) => {
			const trimmed = value?.trim();
			if (!trimmed || trimmed.length === 0) {
				return 'Name cannot be empty or only whitespace';
			}
			return true;
		}
	},
	email: {
		required: 'Email is required',
		pattern: {
			value: EMAIL_REGEX,
			message: 'Please enter a valid email address'
		}
	},
	password: {
		required: 'Password is required',
		minLength: {
			value: 8,
			message: 'Password must be at least 8 characters long'
		},
		validate: (value: string) => {
			if (!/[a-z]/.test(value)) {
				return 'Password must contain at least one lowercase letter';
			}
			if (!/[A-Z]/.test(value)) {
				return 'Password must contain at least one uppercase letter';
			}
			if (!/\d/.test(value)) {
				return 'Password must contain at least one number';
			}
			if (!/[@$!%*?&]/.test(value)) {
				return 'Password must contain at least one special character (@$!%*?&)';
			}
			return true;
		}
	},
	confirmPassword: {
		required: 'Please confirm your password',
	}
};

// Validation rules for login (minimal validation)
const loginValidationRules = {
	email: {
		required: 'Email is required',
		pattern: {
			value: EMAIL_REGEX,
			message: 'Please enter a valid email address'
		}
	},
	password: {
		required: 'Password is required'
	}
};

interface UserFormProps {
	mode: 'login' | 'register';
}

interface LoginFormData {
	email: string;
	password: string;
}

interface SignupFormData extends LoginFormData {
	name: string;
	confirmPassword: string;
}

interface FormError {
	data?: {
		message?: string;
	};
	message?: string;
}

const UserForm: React.FC<UserFormProps> = ({ mode }) => {
	const [submitError, setSubmitError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>();

	// Selecting the correct mutation based on the mode
	const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
	const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();

	const isLoading = mode === 'login' ? isLoginLoading : isRegisterLoading;

	// Use different validation rules based on mode
	const validationRules = mode === 'login' ? loginValidationRules : signupValidationRules;

	const onSubmit = async (data: LoginFormData | SignupFormData) => {
		try {
			setSubmitError(null);
			if (mode === 'login') {
				await loginUser(data as LoginFormData).unwrap();
			} else {
				await registerUser(data as SignupFormData).unwrap();
			}

			navigate('/focus-records');
		} catch (error) {
			const err = error as FormError;
			setSubmitError(err?.data?.message || err?.message || 'An error occurred. Please try again.');
		}
	};

	const chosenColorObj = TAILWIND_COLORS_OBJ['blue']['blue-500'];

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-4 w-full sm:max-w-[400px] bg-color-gray-300 p-10 rounded-xl"
		>
			<div className="flex justify-center">
				<img src="/checklist-icon.svg" className="w-[80px] h-[80px]" />
			</div>
			{mode === 'register' && (
				<FormInput
					id="name"
					type="text"
					placeholder="Name"
					iconName="person"
					register={register('name', (validationRules as typeof signupValidationRules).name)}
					error={errors.name}
				/>
			)}
			<FormInput
				id="email"
				type="email"
				placeholder="Email"
				iconName="email"
				register={register('email', validationRules.email)}
				error={errors.email}
			/>
			<FormInput
				id="password"
				type="password"
				placeholder="Password"
				iconName="lock"
				register={register('password', validationRules.password)}
				error={errors.password}
			/>
			{mode === 'register' && (
				<FormInput
					id="confirmPassword"
					type="password"
					placeholder="Confirm Password"
					iconName="lock"
					register={register('confirmPassword', {
						...(validationRules as typeof signupValidationRules).confirmPassword,
						validate: (value, formValues) => value === formValues.password || 'Passwords do not match'
					})}
					error={errors.confirmPassword}
				/>
			)}

			{submitError && (
				<div className="bg-red-500/10 border border-red-500 text-red-500 rounded-xl p-3 text-sm">
					{submitError}
				</div>
			)}

			<button
				type="submit"
				disabled={isLoading}
				className={classNames(chosenColorObj.bgColor, 'w-full rounded-xl p-2 mt-4')}
			>
				{mode === 'login' ? 'Login' : 'Sign Up'}
			</button>

			<div className="text-center">
				{mode === 'register' ? (
					<div>
						Have an account already?{' '}
						<Link
							href="/login"
							className={classNames(chosenColorObj.textColor, chosenColorObj.borderColor, 'cursor-pointer border-b pb-[1.5px]')}
						>
							Login
						</Link>
					</div>
				) : (
					<div>
						Don't have an account?{' '}
						<Link
							href="/signup"
							className={classNames(chosenColorObj.textColor, chosenColorObj.borderColor, 'cursor-pointer border-b pb-[1.5px]')}
						>
							Sign Up
						</Link>
					</div>
				)}
			</div>
		</form>
	);
};

export default UserForm;

import Icon from '../Icon';
import { useRevalidateCrossesMidnightMutation } from '../../services/resources/focusRecordsApi';
import { useState } from 'react';
import Tooltip from '../Tooltip';
import Spinner from '../Loaders/Spinner';

interface RevalidationResult {
	updated: number;
	falseToTrue: number;
	trueToFalse: number;
	unchanged: number;
	failed: number;
}

interface RevalidationError {
	data?: {
		message?: string;
	};
	message?: string;
}

const RevalidateCrossesMidnight = () => {
	const [isRevalidating, setIsRevalidating] = useState(false);

	const [revalidateCrossesMidnight] = useRevalidateCrossesMidnightMutation();

	const handleRevalidate = async () => {
		// Get user's timezone
		const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		// Show confirmation dialog
		const confirmed = confirm(
			`This will revalidate all focus records.\n\nThis process will check if each record crosses midnight in your current timezone (${timezone}).\n\nContinue?`
		);

		if (!confirmed) {
			return;
		}

		try {
			setIsRevalidating(true);

			// Process all records in single request
			const revalidationResult = await revalidateCrossesMidnight({ timezone }).unwrap() as RevalidationResult;

			// Show summary
			const message = `Revalidation complete!\n\nUpdated: ${revalidationResult.updated.toLocaleString()} records\n  • Changed false → true: ${revalidationResult.falseToTrue.toLocaleString()}\n  • Changed true → false: ${revalidationResult.trueToFalse.toLocaleString()}\n\nUnchanged: ${revalidationResult.unchanged.toLocaleString()} records\nFailed: ${revalidationResult.failed.toLocaleString()} records`;

			alert(message);
		} catch (error) {
			const err = error as RevalidationError;
			console.error('Error revalidating crossesMidnight:', err);
			const errorMessage = err?.data?.message || 'Failed to revalidate records';
			alert(`Error: ${errorMessage}`);
		} finally {
			setIsRevalidating(false);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<button
					onClick={handleRevalidate}
					disabled={isRevalidating}
					aria-busy={isRevalidating}
					className="flex items-center gap-2 px-3 py-2 bg-color-gray-300 hover:bg-color-gray-200 rounded-full text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed justify-center"
				>
					{isRevalidating ? (
						<Spinner size="sm" />
					) : (
						<Icon
							name="schedule"
							fill={1}
							customClass="!text-[20px]"
						/>
					)}
					<span>{isRevalidating ? 'Revalidating Midnight Crossing...' : 'Revalidate Midnight Crossing'}</span>
				</button>
				<Tooltip
					content="Recalculates whether each focus record crosses midnight based on your current timezone. Useful after changing timezones to ensure accuracy."
					position="bottom"
					className="!w-[200px]"
				>
					<div className="mt-4">
						<Icon
							name="help_outline"
							fill={0}
							customClass="!text-[20px] text-color-gray-100 hover:text-white cursor-help"
						/>
					</div>
				</Tooltip>
			</div>
		</div>
	);
};

export default RevalidateCrossesMidnight;

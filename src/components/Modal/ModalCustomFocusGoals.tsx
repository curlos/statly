import React from 'react';
import Modal from './Modal';
import Icon from '../Icon';
import { getFormattedLongDay } from '../../utils/date.utils';
import { getFormattedDuration } from '../../utils/focus-apps/helpers.utils';

interface ModalCustomFocusGoalsProps {
	isOpen: boolean;
	onClose: () => void;
	customDailyFocusGoal: { [key: string]: number };
}

const ModalCustomFocusGoals: React.FC<ModalCustomFocusGoalsProps> = ({ isOpen, onClose, customDailyFocusGoal }) => {
	// Get all custom focus goal dates and sort them (newest first)
	const customGoalDates = Object.entries(customDailyFocusGoal || {})
		.map(([dateKey, goalSeconds]) => ({ dateKey, goalSeconds }))
		.sort((a, b) => new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime());

	const formatDate = (dateKey: string) => {
		try {
			const dateObj = new Date(dateKey + 'T12:00:00');
			if (isNaN(dateObj.getTime())) throw new Error('Invalid date');
			return getFormattedLongDay(dateObj);
		} catch {
			return 'Invalid Date';
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} customClasses="!max-w-[600px]">
			<div className="bg-color-gray-700 rounded-lg p-6">
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<h3 className="text-xl font-semibold">Custom Focus Goal Days</h3>
					<button
						onClick={onClose}
						className="text-color-gray-100 hover:text-white transition-colors"
					>
						<Icon name="close" fill={1} customClass="!text-[24px]" />
					</button>
				</div>

				{/* List or Empty State */}
				{customGoalDates.length === 0 ? (
					<div className="text-center py-8 text-color-gray-100">
						<Icon name="tune" fill={1} customClass="!text-[48px] mb-2 opacity-50" />
						<p className="text-[14px]">No custom focus goal days set</p>
					</div>
				) : (
					<div className="max-h-[500px] overflow-auto gray-scrollbar">
						{customGoalDates.map(({ dateKey, goalSeconds }) => (
							<div
								key={dateKey}
								className="p-3 bg-color-gray-600 rounded-lg mb-2 flex items-center justify-between"
							>
								<span className="text-[16px] text-white">{formatDate(dateKey)}</span>
								<span className="text-[16px] text-color-gray-100 font-medium">
									{getFormattedDuration(goalSeconds, false)}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</Modal>
	);
};

export default ModalCustomFocusGoals;

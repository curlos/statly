import Modal from './Modal';
import { useDispatch, useSelector } from 'react-redux';
import { setModalState } from '../../slices/modalSlice';
import TextareaAutosize from 'react-textarea-autosize';
import Icon from '../Icon';
import { useEffect, useState } from 'react';
import useHandleError from '../../hooks/useHandleError';
import {
	useAddHabitLogMutation,
	useEditHabitLogMutation,
	useGetHabitLogsQuery,
} from '../../services/resources/habitLogsApi';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getFormattedLongDay } from '../../utils/date.utils';

const ModalAddHabitLog: React.FC = () => {
	const modal = useSelector((state) => state.modals.modals['ModalAddHabitLog']);
	const dispatch = useDispatch();
	const handleError = useHandleError();

	// RTK Query - Habit Logs
	const [addHabitLog] = useAddHabitLogMutation();
	const [editHabitLog] = useEditHabitLogMutation();
	const { data: fetchedHabitLogs } = useGetHabitLogsQuery();
	const { habitLogsById } = fetchedHabitLogs || {};

	const [checkedInDay, setCheckedInDay] = useState(null);
	const [checkedInDayKey, setCheckedInDayKey] = useState(null);
	const [habitLogContent, setHabitLogContent] = useState('');

	useEffect(() => {
		if (modal?.props?.habit && habitLogsById) {
			const { habit, checkedInDay, checkedInDayKey } = modal.props;

			if (checkedInDay && checkedInDay.habitLogId) {
				const habitLog = habitLogsById[checkedInDay.habitLogId];
				setHabitLogContent(habitLog.content);
			} else {
				setHabitLogContent('');
			}
		} else {
			setHabitLogContent('');
		}
	}, [modal?.props?.habit, habitLogsById]);

	useEffect(() => {
		if (modal?.props) {
			setCheckedInDay(modal.props.checkedInDay);
			setCheckedInDayKey(modal.props.checkedInDayKey);
		}
	}, [modal?.props?.checkedInDay, modal?.props?.checkedInDayKey]);

	if (!modal) {
		return null;
	}

	const {
		isOpen,
		props: { habit, isReadOnly },
	} = modal;

	if (!habit) {
		return null;
	}

	const closeModal = () => {
		dispatch(setModalState({ modalId: 'ModalAddHabitLog', isOpen: false }));
	};

	const getHabitNameAndDay = () => (
		<div className="flex items-center gap-2 mr-[10px]">
			<img src={habit.icon} className="w-[60px] h-[60px]" />
			<div>
				<h3 className="font-bold text-[16px]">{habit.name}</h3>
				<div className="text-left text-color-gray-100">{checkedInDayKey}</div>
			</div>
		</div>
	);

	const getCheckedInDayForHabit = (type) => {
		const newCheckedInDayDate = new Date(checkedInDayKey);

		if (type === 'previous') {
			newCheckedInDayDate.setDate(newCheckedInDayDate.getDate() - 1);
		} else {
			newCheckedInDayDate.setDate(newCheckedInDayDate.getDate() + 1);
		}

		const newCheckedInDayKey = getFormattedLongDay(newCheckedInDayDate);
		console.log(newCheckedInDayKey);

		const habit = modal?.props?.habit;
		const newCheckedInDay = habit.checkedInDays[newCheckedInDayKey];
		const habitLog = newCheckedInDay?.habitLogId && habitLogsById[newCheckedInDay.habitLogId];
		const habitLogContent = habitLog?.content || '';

		setHabitLogContent(habitLogContent);
		setCheckedInDay(newCheckedInDay);
		setCheckedInDayKey(newCheckedInDayKey);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => dispatch(setModalState({ modalId: 'ModalAddHabitLog', isOpen: false }))}
			position="top-center"
		>
			<div className="rounded-xl shadow-lg bg-color-gray-600 p-5 select-none">
				{isReadOnly ? (
					<div className="flex justify-between items-center mb-4">
						<Icon
							name="chevron_left"
							customClass={'!text-[28px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={() => getCheckedInDayForHabit('previous')}
						/>

						{getHabitNameAndDay()}

						<Icon
							name="chevron_right"
							customClass={'!text-[28px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={() => getCheckedInDayForHabit('next')}
						/>
					</div>
				) : (
					<div className="flex justify-between mb-4">
						<div></div>

						{getHabitNameAndDay()}

						<Icon
							name="close"
							customClass={'!text-[20px] text-color-gray-100 hover:text-white cursor-pointer'}
							onClick={closeModal}
						/>
					</div>
				)}

				<div className="space-y-2">
					{/* Focus Note */}
					{isReadOnly ? (
						<div className="text-color-gray-50 break-words react-markdown h-[350px] overflow-auto gray-scrollbar">
							{habitLogContent ? (
								<ReactMarkdown remarkPlugins={[remarkGfm]}>{habitLogContent}</ReactMarkdown>
							) : (
								<div className="text-center">No Habit Log for the day</div>
							)}
						</div>
					) : (
						<div className="flex gap-2">
							<TextareaAutosize
								className={classNames(
									'flex-1 text-[13px] placeholder:text-[#7C7C7C] mt-2 mb-4 bg-transparent outline-none resize-none border border-color-gray-200 rounded p-2 min-h-[200px] max-h-[300px] overflow-auto gray-scrollbar',
									habit.isArchived ? 'cursor-not-allowed' : 'hover:border-blue-500'
								)}
								placeholder="What do you have in mind?"
								value={habitLogContent}
								onChange={(e) => setHabitLogContent(e.target.value)}
								readOnly={habit?.isArchived}
							></TextareaAutosize>
						</div>
					)}
				</div>

				{!habit?.isArchived && !isReadOnly && (
					<div className="flex justify-end gap-2">
						<button
							className="border border-color-gray-200 rounded py-1 cursor-pointer hover:bg-color-gray-200 min-w-[114px]"
							onClick={closeModal}
						>
							Close
						</button>
						<button
							className="bg-blue-500 rounded py-1 cursor-pointer hover:bg-blue-600 min-w-[114px]"
							onClick={() => {
								handleError(async () => {
									closeModal();

									// If the checked day does not exist or it does exist but no habit log has been added for it yet, then ADD a NEW habit log.
									if (!checkedInDay || !checkedInDay.habitLogId) {
										handleError(async () => {
											const payload = {
												content: habitLogContent,
												habitId: habit._id,
												checkedInDayKey,
											};

											await addHabitLog(payload).unwrap();
											setHabitLogContent('');
										});
									} else if (checkedInDay?.habitLogId) {
										// If the checked day exists AND a habit log exists, then EDIT the EXISTING habit log.

										handleError(async () => {
											const payload = {
												habitLogId: checkedInDay.habitLogId,
												habitLogPayload: {
													content: habitLogContent,
													habitId: habit._id,
													checkedInDayKey,
												},
											};

											await editHabitLog(payload).unwrap();
											setHabitLogContent('');
										});
									}
								});
							}}
						>
							Ok
						</button>
					</div>
				)}
			</div>
		</Modal>
	);
};

export default ModalAddHabitLog;

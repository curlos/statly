import classNames from 'classnames';
import { navigate } from 'vike/client/router';
import { useStatsContext } from '../../../contexts/useStatsContext';

const ProgressBar = ({ item, fromModal = false }) => {
	const { projectsById, sessionCategoriesById } = useStatsContext();

	const handleGoToFocusRecordsPage = () => {
		let queryParams = '';

		const { id } = item;

		switch (item.type) {
			case 'task':
				queryParams += `?task-id=${id}`;
				break;
			case 'project':
				// If the project is from TickTick.
				if (projectsById[id]) {
					queryParams += `?projects=${id}`;
					// If the project is a category from "Session App".
				} else if (sessionCategoriesById[id]) {
					queryParams += `?categories=${id}`;
					// If the project is one of the focus apps that don't have separate projects (Forest, Tide, and BeFocused).
				} else if (id === 'forest-app' || id === 'tide-ios-app' || id === 'be-focused-app') {
					queryParams += `?focus-apps=${id}`;
				}

				break;
		}

		navigate('/ticktick-1.00/focus-records' + queryParams);
	};

	return (
		<div>
			<div className="flex justify-between items-center mb-1 w-full">
				<div
					className={classNames(
						!fromModal
							? 'truncate w-[150px] xs:w-[200px] sm:w-[150px] md:w-[200px] lg:w-[110px] xl:w-[200px]'
							: 'truncate w-[150px] xs:w-[200px] sm:w-[150px] md:w-[350px] break-words',
						'text-[14px] md:text-[16px] lg:text-[14px] xl:text-[16px]',
						'cursor-pointer hover:underline'
					)}
					onClick={handleGoToFocusRecordsPage}
				>
					{item.name}
				</div>
				<div className="text-[14px] md:text-[16px] lg:text-[14px] xl:text-[16px] text-[#8C8C8C] truncate">
					{item.value} • {item.percentage}%
				</div>
			</div>
			<div key={item.id} className="rounded-full dark:bg-[#232323]">
				<div
					className={`text-xs font-medium text-blue-100 text-center p-[3px] leading-none rounded-full`}
					style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
				/>
			</div>
		</div>
	);
};

export default ProgressBar;

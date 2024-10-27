import DailyHoursFocusGoal from '../DailyHoursFocusGoal';
import { useData } from 'vike-react/useData';
import type { Data } from './+data.js';

const Page = () => {
	const focusRecords = useData<Data>();

	return (
		<div className="flex max-w-screen max-h-screen bg-color-gray-700">
			<div className="w-screen h-screen flex justify-center items-center">
				<div className="w-[350px]">
					<DailyHoursFocusGoal />
				</div>
			</div>
		</div>
	);
};

export default Page;

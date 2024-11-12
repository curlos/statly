import { useRef, useState } from 'react';
import DropdownFocusRankingList from '../DropdownFocusRankingList';
import ProgressBar from '../ProgressBar';

interface ProgressBarListProps {
	data: Array<any>;
}

const ProgressBarList: React.FC<ProgressBarListProps> = ({ data }) => {
	const dropdownFocusRankingListRef = useRef(null);
	const [isDropdownFocusRankingListVisible, setIsDropdownFocusRankingListVisible] = useState(false);

	const sortedData = data.sort((a, b) => b.percentage - a.percentage);

	return (
		<div className="space-y-4 w-full">
			{sortedData.slice(0, 5).map((item) => (
				<ProgressBar key={item.name} item={item} />
			))}

			<div className="relative">
				<div
					ref={dropdownFocusRankingListRef}
					onClick={() => setIsDropdownFocusRankingListVisible(!isDropdownFocusRankingListVisible)}
					className="text-color-gray-100 cursor-pointer text-[16px] lg:text-[14px] xl:text-[16px]"
				>
					View More
				</div>

				<DropdownFocusRankingList
					toggleRef={dropdownFocusRankingListRef}
					isVisible={isDropdownFocusRankingListVisible}
					setIsVisible={setIsDropdownFocusRankingListVisible}
					progressData={data}
				/>
			</div>
		</div>
	);
};

export default ProgressBarList;

import { useState, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import useMaxHeight from '../../hooks/useMaxHeight';
import TopButtonList from '../medals/TopButtonList';
import useResizeObserver from '../../hooks/useResizeObserver';
import ChallengeList from './ChallengeList/ChallengeList';
import ChosenChallenge from './ChosenChallenge';
import ChosenChallengeSkeleton from './ChosenChallengeSkeleton';
import Modal from '../../components/Modal/Modal';
import Icon from '../../components/Icon';
import { usePageContext } from 'vike-react/usePageContext';
import { useGetFocusChallengesQuery } from '../../services/resources/focusRecordsApi';
import { useGetTasksChallengesQuery } from '../../services/resources/tasksApi';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';
import { useApplyDefaultDateRangeContext } from '../../contexts/useApplyDefaultDateRangeContext';
import AppliedFilterItemList from '../focus-records/AppliedFilterItemList';
import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import { useThemeContext } from '../../contexts/useThemeContext';
import classNames from 'classnames';
import type { Challenge } from '../../types/api';

const Page = () => {
	const pageContext = usePageContext();
	const { type } = pageContext.routeParams;
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const [chosenChallenge, setChosenChallenge] = useState<Challenge | null>(null);
	const chosenChallengeRef = useRef(null);
	const [showChosenChallengeModal, setShowChosenChallengeModal] = useState(false);
	const [isFilterSidebarModalOpen, setIsFilterSidebarModalOpen] = useState(false);

	// Top Header
	const [headerHeight, setHeaderHeight] = useState(0);
	const topHeaderRef = useRef(null);
	useResizeObserver(topHeaderRef, setHeaderHeight as (value: number | Record<string, number>) => void, 'height');
	const maxHeight = useMaxHeight(headerHeight + 20);

	// Build query params using shared hook
	const { queryParams } = useSharedQueryParams();
	const { shouldSkipQuery } = useApplyDefaultDateRangeContext();

	// Fetch challenges data from backend based on type
	const { data: focusChallengesData, isLoading: isLoadingFocusChallenges } = useGetFocusChallengesQuery(queryParams, {
		skip: type !== 'focus' || shouldSkipQuery
	});

	const { data: tasksChallengesData, isLoading: isLoadingTasksChallenges } = useGetTasksChallengesQuery(queryParams, {
		skip: type !== 'tasks' || shouldSkipQuery
	});

	const challengesData = type === 'focus' ? focusChallengesData : tasksChallengesData;
	const isLoading = type === 'focus' ? isLoadingFocusChallenges : isLoadingTasksChallenges;

	const BUTTONS_MEDALS_TYPE_OBJ = [
		{
			name: 'Focus',
			urlName: 'focus',
		},
		{
			name: 'Tasks',
			urlName: 'tasks',
		},
	];

	return (
		<div className="max-w-screen min-h-screen bg-color-gray-700">
			<div ref={topHeaderRef}>
				<Navbar page="challenges-page" />
				<div className="container flex justify-between items-center">
					<div className="flex items-center gap-4">
						<div className="text-[28px] font-bold">Challenges</div>

						<div className="hidden lg:block">
							<AppliedFilterItemList />
						</div>
					</div>

					<div
						className={classNames(
							'flex items-center gap-2 rounded-3xl border border-color-gray-200 px-4 py-1 transition-colors',
							chosenColorObj.hover.borderColor,
							chosenColorObj.hover.textColor
						)}
						onClick={() => !isLoading && setIsFilterSidebarModalOpen(!isFilterSidebarModalOpen)}
						style={{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
					>
						<div className="hidden sm:block">Filter</div>
						<Icon
							name="page_info"
							fill={0}
							customClass={'!text-[20px] cursor-pointer'}
						/>
					</div>
				</div>
				<div className="container grid grid-cols-12">
					<div className="col-span-8">
						<TopButtonList {...{ BUTTONS_OBJ: BUTTONS_MEDALS_TYPE_OBJ, isForInterval: false }} />
					</div>
				</div>
			</div>

			<div className="container grid grid-cols-12 gap-2">
				<div className="col-span-12 md:col-span-7 lg:col-span-8 mr-2">
					<ChallengeList
						{...{ maxHeight, chosenChallenge, setChosenChallenge, setShowChosenChallengeModal, challengesData, isLoading }}
					/>
				</div>

				<div className="hidden sm:block md:col-span-5 lg:col-span-4">
					{isLoading ? (
					<ChosenChallengeSkeleton {...{ maxHeight, chosenChallengeRef }} />
				) : (
					<ChosenChallenge {...{ chosenChallenge, maxHeight, chosenChallengeRef }} />
				)}
				</div>

				<div className="md:hidden">
					<Modal
						isOpen={showChosenChallengeModal}
						onClose={() => setShowChosenChallengeModal(false)}
					>
						<div className="rounded-xl shadow-lg bg-color-gray-600 p-2 max-w-[]">
							{isLoading ? (
					<ChosenChallengeSkeleton {...{ maxHeight, chosenChallengeRef }} />
				) : (
					<ChosenChallenge {...{ chosenChallenge, maxHeight, chosenChallengeRef }} />
				)}
						</div>
					</Modal>
				</div>
			</div>

			{isFilterSidebarModalOpen && (
				<ModalFilterSidebar
					{...{
						isOpen: isFilterSidebarModalOpen,
						setIsOpen: setIsFilterSidebarModalOpen,
						page: 'challenges',
					}}
				/>
			)}
		</div>
	);
};

export default Page;

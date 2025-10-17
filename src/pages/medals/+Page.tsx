import { useEffect, useRef, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import useMaxHeight from '../../hooks/useMaxHeight';
import useResizeObserver from '../../hooks/useResizeObserver';
import TopButtonList from './TopButtonList';
import MedalList from './MedalList/MedalList';
import ChosenMedal from './ChosenMedal';
import ChosenMedalSkeleton from './ChosenMedalSkeleton';
import Modal from '../../components/Modal/Modal';
import Icon from '../../components/Icon';
import ChallengesAndMedalsSettingsModal from '../challenges/ChallengesAndMedalsSettingsModal';
import { usePageContext } from 'vike-react/usePageContext';
import { useGetFocusMedalsQuery } from '../../services/resources/documentsFocusRecordsApi';
import { useGetTasksMedalsQuery } from '../../services/resources/documentsTasksApi';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';

const Page = () => {
	const pageContext = usePageContext();
	const { type, interval } = pageContext.routeParams;

	const [chosenMedal, setChosenMedal] = useState({});
	const chosenMedalRef = useRef(null);
	const [showChosenMedalModal, setShowChosenMedalModal] = useState(false);
	const [isSettingsSidebarModalOpen, setIsSettingsSidebarModalOpen] = useState(false);

	// Top Header
	const [headerHeight, setHeaderHeight] = useState(0);
	const topHeaderRef = useRef(null);
	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');
	const maxHeight = useMaxHeight(headerHeight + 20);

	// Build query params using shared hook
	const sharedQueryParams = useSharedQueryParams();
	const queryParams = {
		...sharedQueryParams.queryParams,
		interval,
	};

	// Fetch medals data from backend based on type
	const { isLoading: isLoadingFocusMedals } = useGetFocusMedalsQuery(queryParams, {
		skip: type !== 'focus'
	});

	const { isLoading: isLoadingTasksMedals } = useGetTasksMedalsQuery(queryParams, {
		skip: type !== 'tasks'
	});

	const isLoading = type === 'focus' ? isLoadingFocusMedals : isLoadingTasksMedals;

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

	const BUTTONS_INTERVALS_OBJ = [
		{
			name: 'Daily',
			urlName: 'daily',
		},
		{
			name: 'Weekly',
			urlName: 'weekly',
		},
		{
			name: 'Monthly',
			urlName: 'monthly',
		},
		{
			name: 'Yearly',
			urlName: 'yearly',
		},
	];

	useEffect(() => {
		chosenMedalRef?.current?.scrollTo(0, 0);
	}, [chosenMedal]);

	return (
		<div>
			<div className="max-w-screen min-h-screen bg-color-gray-700">
				<div ref={topHeaderRef}>
					<Navbar />
					<div className="container flex justify-between items-center">
						<div className="text-[28px] font-bold">Medals</div>
						<Icon
							name="settings"
							customClass={'!text-[30px] text-color-gray-100 cursor-pointer mr-[15px]'}
							onClick={() => setIsSettingsSidebarModalOpen(!isSettingsSidebarModalOpen)}
						/>
					</div>
					<div className="container grid grid-cols-12">
						<div className="flex flex-col lg:flex-row lg:items-center justify-between col-span-8">
							<TopButtonList {...{ BUTTONS_OBJ: BUTTONS_MEDALS_TYPE_OBJ, isForInterval: false }} />
							<div className="mr-md-2 mr-xl-3">
								<TopButtonList {...{ BUTTONS_OBJ: BUTTONS_INTERVALS_OBJ }} />
							</div>
						</div>
					</div>
				</div>

				<div className="container grid grid-cols-12 gap-3">
					<MedalList {...{ maxHeight, chosenMedal, setChosenMedal, setShowChosenMedalModal }} />

					<div className="hidden sm:block col-span-4">
						{isLoading ? (
							<ChosenMedalSkeleton {...{ maxHeight, chosenMedalRef }} />
						) : (
							<ChosenMedal {...{ chosenMedal, maxHeight, chosenMedalRef }} />
						)}
					</div>

					<div className="sm:hidden">
						<Modal
							isOpen={showChosenMedalModal}
							onClose={() => setShowChosenMedalModal(false)}
							position="top-center"
						>
							<div className="rounded-xl shadow-lg bg-color-gray-600 p-2">
								{isLoading ? (
									<ChosenMedalSkeleton {...{ maxHeight, chosenMedalRef }} />
								) : (
									<ChosenMedal {...{ chosenMedal, maxHeight, chosenMedalRef }} />
								)}
							</div>
						</Modal>
					</div>
				</div>
			</div>

			{isSettingsSidebarModalOpen && (
				<ChallengesAndMedalsSettingsModal
					{...{
						isSidebarModalOpen: isSettingsSidebarModalOpen,
						setIsSidebarModalOpen: setIsSettingsSidebarModalOpen,
						page: 'medals',
					}}
				/>
			)}
		</div>
	);
};

export default Page;

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
import ChallengesAndMedalsSettingsModal from './ChallengesAndMedalsSettingsModal';
import { usePageContext } from 'vike-react/usePageContext';
import { useGetFocusChallengesQuery } from '../../services/resources/documentsFocusRecordsApi';
import { useGetTasksChallengesQuery } from '../../services/resources/documentsTasksApi';
import { useSharedQueryParams } from '../../hooks/useSharedQueryParams';

const Page = () => {
	const pageContext = usePageContext();
	const { type } = pageContext.routeParams;

	const [chosenChallenge, setChosenChallenge] = useState({});
	const chosenChallengeRef = useRef(null);
	const [showChosenChallengeModal, setShowChosenChallengeModal] = useState(false);
	const [isSettingsSidebarModalOpen, setIsSettingsSidebarModalOpen] = useState(false);

	// Top Header
	const [headerHeight, setHeaderHeight] = useState(0);
	const topHeaderRef = useRef(null);
	useResizeObserver(topHeaderRef, setHeaderHeight, 'height');
	const maxHeight = useMaxHeight(headerHeight + 20);

	// Build query params using shared hook
	const queryParams = useSharedQueryParams();

	// Fetch challenges data from backend based on type
	const { isLoading: isLoadingFocusChallenges } = useGetFocusChallengesQuery(queryParams, {
		skip: type !== 'focus'
	});

	const { isLoading: isLoadingTasksChallenges } = useGetTasksChallengesQuery(queryParams, {
		skip: type !== 'tasks'
	});

	const isLoading = type === 'focus' ? isLoadingFocusChallenges : isLoadingTasksChallenges;

	const BUTTONS_MEDALS_TYPE_OBJ = [
		// {
		// 	name: 'Custom',
		// 	urlName: 'custom',
		// },
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
				<Navbar />
				<div className="container flex justify-between items-center">
					<div className="text-[28px] font-bold">Challenges</div>
					<Icon
						name="settings"
						customClass={'!text-[30px] text-color-gray-100 cursor-pointer mr-[15px]'}
						onClick={() => setIsSettingsSidebarModalOpen(!isSettingsSidebarModalOpen)}
					/>
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
						{...{ maxHeight, chosenChallenge, setChosenChallenge, setShowChosenChallengeModal }}
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
						position="top-center"
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

			{isSettingsSidebarModalOpen && (
				<ChallengesAndMedalsSettingsModal
					{...{
						isSidebarModalOpen: isSettingsSidebarModalOpen,
						setIsSidebarModalOpen: setIsSettingsSidebarModalOpen,
						page: 'challenges',
					}}
				/>
			)}
		</div>
	);
};

export default Page;

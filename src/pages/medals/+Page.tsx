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
import { usePageContext } from 'vike-react/usePageContext';
import AppliedFilterItemList from '../focus-records/AppliedFilterItemList';
import ModalFilterSidebar from '../../components/FilterSidebar/ModalFilterSidebar';
import { useThemeContext } from '../../contexts/useThemeContext';
import classNames from 'classnames';
import type { MedalWithName } from '../../types/api';
import { useMedalsQuery } from './useMedalsQuery';

const Page = () => {
	const pageContext = usePageContext();
	const { type, interval } = pageContext.routeParams;
	const themeContext = useThemeContext();
	const { chosenColorObj } = themeContext;

	const [chosenMedal, setChosenMedal] = useState<MedalWithName | null>(null);
	const chosenMedalRef = useRef<HTMLDivElement>(null);
	const [showChosenMedalModal, setShowChosenMedalModal] = useState(false);
	const [isFilterSidebarModalOpen, setIsFilterSidebarModalOpen] = useState(false);

	// Top Header
	const [headerHeight, setHeaderHeight] = useState(0);
	const topHeaderRef = useRef<HTMLDivElement>(null);
	useResizeObserver(topHeaderRef, setHeaderHeight as (value: number | Record<string, number>) => void, 'height');
	const maxHeight = useMaxHeight(headerHeight + 20);

	// Use the medals query hook which handles defaults and prevents duplicate API calls
	const { medalsData, isLoading } = useMedalsQuery({ type, interval });

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
					<Navbar page="medals-page" />
					<div className="container flex justify-between items-center">
						<div className="flex items-center gap-4">
							<div className="text-[28px] font-bold">Medals</div>

							<div className="hidden md:block">
								<AppliedFilterItemList />
							</div>
						</div>

						<div
							className={classNames(
								'flex items-center gap-2 rounded-3xl border border-color-gray-100 px-4 py-1 transition-colors',
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
						<div className="flex flex-col lg:flex-row lg:items-center justify-between col-span-8">
							<TopButtonList {...{ BUTTONS_OBJ: BUTTONS_MEDALS_TYPE_OBJ, isForInterval: false }} />
							<div className="mr-md-2 mr-xl-3">
								<TopButtonList {...{ BUTTONS_OBJ: BUTTONS_INTERVALS_OBJ }} />
							</div>
						</div>
					</div>
				</div>

				<main id="main-content" tabIndex={-1} className="container grid grid-cols-12 gap-3 outline-none">
					<MedalList {...{ maxHeight, chosenMedal, setChosenMedal, setShowChosenMedalModal, medalsData, isLoading, type, interval }} />

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
				</main>
			</div>

			{isFilterSidebarModalOpen && (
				<ModalFilterSidebar
					{...{
						isOpen: isFilterSidebarModalOpen,
						setIsOpen: setIsFilterSidebarModalOpen,
						page: 'medals',
					}}
				/>
			)}
		</div>
	);
};

export default Page;

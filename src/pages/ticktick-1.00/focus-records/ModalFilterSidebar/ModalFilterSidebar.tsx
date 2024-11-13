import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../../components/Icon';
import { useUpdateQueryParams } from '../../../../hooks/useUpdateQueryParams';
import CustomRadioButton from '../../../../components/CustomRadioButton';

const ModalFilterSidebar = ({
	isOpen,
	setIsOpen,
	searchText,
	setSearchText,
	sortedBy,
	setSortedBy,
	groupedBy,
	setGroupedBy,
	sortByOptions,
	GROUP_BY_OPTIONS,
}) => {
	const sidebarVariants = {
		hidden: { x: 300, opacity: 0, transition: { duration: 0.3 } },
		visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
	};

	const backdropVariants = {
		hidden: { opacity: 0, transition: { duration: 0.3 } },
		visible: { opacity: 0.7, transition: { duration: 0.3 } },
	};

	const updateQueryParams = useUpdateQueryParams();

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial="hidden"
					animate="visible"
					exit="hidden"
					className="fixed inset-0 z-40 flex justify-end"
				>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={backdropVariants}
						className="overlay absolute bg-black inset-0"
						onClick={() => setIsOpen(false)}
					/>
					<motion.div
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={sidebarVariants}
						className="fixed inset-y-0 right-0 w-[85%] max-w-[400px] bg-color-gray-700 p-4 text-white"
						onClick={(e) => e.stopPropagation()} // Prevents click from closing the modal
					>
						<div className="flex justify-between items-center">
							<h2 className="font-bold text-[18px]">Filter</h2>
							<Icon
								name="close"
								fill={0}
								customClass={
									'text-color-gray-50 !text-[22px] hover:text-white cursor-pointer bg-color-gray-600 rounded-2xl p-1'
								}
								onClick={() => setIsOpen(false)}
							/>
						</div>

						<div className="flex items-center gap-1 p-1 px-2 bg-color-gray-600 rounded-3xl mt-4">
							<Icon
								name="search"
								fill={0}
								customClass={'text-color-gray-50 !text-[20px] hover:text-white cursor-pointer'}
							/>
							<input
								placeholder="Search"
								value={searchText}
								onChange={(e) => {
									setSearchText(e.target.value);
									updateQueryParams({ search: searchText });
								}}
								className="text-[16px] bg-transparent placeholder:text-[#7C7C7C] mb-0 w-full outline-none resize-none p-1"
							/>
						</div>

						<hr className="border-color-gray-200 my-4" />

						<div>
							<h3 className="text-[16px] font-bold mb-3">Sort By</h3>

							<div className="space-y-2">
								{sortByOptions.map((sortByOption) => {
									return (
										<CustomRadioButton
											label={sortByOption}
											name={sortByOption}
											checked={sortedBy === sortByOption}
											onChange={() => {
												setSortedBy(sortByOption);
												updateQueryParams({ sortBy: sortByOption });
											}}
											customOuterCircleClasses="!border-blue-500 !w-[20px] !h-[20px]"
											customInnerCircleClasses="!bg-blue-500 !w-[10px] !h-[10px]"
										/>
									);
								})}
							</div>
						</div>

						<hr className="border-color-gray-200 my-4" />

						<div>
							<h3 className="text-[16px] font-bold mb-3">Group By</h3>

							<div className="space-y-2">
								{GROUP_BY_OPTIONS.map((groupByOption) => {
									return (
										<CustomRadioButton
											label={groupByOption}
											name={groupByOption}
											checked={groupedBy === groupByOption}
											onChange={() => {
												setGroupedBy(groupByOption);
												updateQueryParams({ groupBy: groupByOption });
											}}
											customOuterCircleClasses="!border-blue-500 !w-[20px] !h-[20px]"
											customInnerCircleClasses="!bg-blue-500 !w-[10px] !h-[10px]"
										/>
									);
								})}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ModalFilterSidebar;

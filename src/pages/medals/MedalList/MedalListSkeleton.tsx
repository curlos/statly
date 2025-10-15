const MedalCardSkeleton = () => {
	return (
		<div className="bg-color-gray-600 border-2 border-transparent animate-pulse">
			<div className="bg-color-gray-150 border-l-[5px] border-white pl-1 h-[24px] sm:h-[28px]" />
			<div className="flex justify-center mx-2 my-2">
				<div className="w-full aspect-square bg-color-gray-400 rounded" />
			</div>
			<div className="flex justify-end px-2 h-[24px] sm:h-[30px] bg-color-gray-400 rounded mx-2 mb-2" style={{ width: '60px', marginLeft: 'auto' }} />
		</div>
	);
};

const MedalListSkeleton = ({ maxHeight }) => {
	return (
		<div className="col-span-12 sm:col-span-8">
			<div
				className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 overflow-auto gray-scrollbar"
				style={{ maxHeight }}
			>
				{Array.from({ length: 12 }).map((_, index) => (
					<MedalCardSkeleton key={index} />
				))}
			</div>
		</div>
	);
};

export default MedalListSkeleton;

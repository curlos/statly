const ChallengeCardSkeleton = () => {
	return (
		<div className="border-2 border-color-gray-200 animate-pulse flex flex-col">
			<div className="w-full aspect-[6/2] bg-color-gray-400" />
			<div className="py-1 px-2 h-[25px] bg-color-gray-200" />
		</div>
	);
};

const ChallengeListSkeleton = ({ maxHeight }: { maxHeight: string }) => {
	return (
		<div className="overflow-auto gray-scrollbar">
			<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2" style={{ maxHeight }}>
				{Array.from({ length: 12 }).map((_, index) => (
					<ChallengeCardSkeleton key={index} />
				))}
			</div>
		</div>
	);
};

export default ChallengeListSkeleton;

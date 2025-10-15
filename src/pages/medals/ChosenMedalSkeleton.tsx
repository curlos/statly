const ChosenMedalSkeleton = ({ maxHeight, chosenMedalRef }) => {
	return (
		<div
			ref={chosenMedalRef}
			className="flex justify-center mt-5 overflow-auto gray-scrollbar animate-pulse"
			style={{ maxHeight }}
		>
			<div className="w-full max-w-[400px]">
				{/* Medal Image Skeleton */}
				<div className="flex justify-center mb-2">
					<div className="h-[300px] w-[300px] bg-color-gray-400 rounded" />
				</div>

				{/* Medal Title Skeleton */}
				<div className="bg-color-gray-200 px-2 h-[36px] md:h-[40px] mb-2 rounded" />

				{/* Description Skeleton */}
				<div className="mt-2 space-y-3">
					<div className="h-[24px] bg-color-gray-400 rounded w-3/4" />
					<div className="h-[24px] bg-color-gray-400 rounded w-1/2" />

					{/* Days Earned List Skeleton */}
					<div className="space-y-2 pt-2">
						<div className="h-[24px] bg-color-gray-400 rounded w-2/3" />
						<div className="ml-5 space-y-2">
							{Array.from({ length: 5 }).map((_, index) => (
								<div key={index} className="h-[20px] bg-color-gray-400 rounded w-full" />
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChosenMedalSkeleton;

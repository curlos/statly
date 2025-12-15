interface ChosenChallengeSkeletonProps {
	maxHeight: string;
	chosenChallengeRef: React.RefObject<HTMLDivElement>;
}

const ChosenChallengeSkeleton: React.FC<ChosenChallengeSkeletonProps> = ({ maxHeight, chosenChallengeRef }) => {
	return (
		<div
			ref={chosenChallengeRef}
			className="flex mt-5 overflow-auto gray-scrollbar animate-pulse"
			style={{ maxHeight }}
		>
			<div className="w-full">
				{/* Challenge Image Skeleton */}
				<div className="flex justify-center mb-2">
					<div className="w-full aspect-[7/2] bg-color-gray-200 animate-pulse" />
				</div>

				{/* Challenge Title Skeleton */}
				<div className="bg-color-gray-200 px-2 h-[36px] mb-2" />

				{/* Description Fields Skeleton */}
				<div className="mt-2 space-y-3">
					<div className="h-[20px] bg-color-gray-300 w-3/4" />
					<div className="h-[20px] bg-color-gray-300 w-2/3" />
				</div>
			</div>
		</div>
	);
};

export default ChosenChallengeSkeleton;

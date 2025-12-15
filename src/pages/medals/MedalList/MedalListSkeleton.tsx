import Icon from '../../../components/Icon';

const MedalCardSkeleton = () => {
	return (
		<div className="bg-color-gray-600 border-2 border-transparent">
			<div className="bg-color-gray-150 border-l-[5px] border-white pl-1 h-[24px] sm:h-[28px] animate-pulse" />
			<div className="flex justify-center mx-2 my-2">
				<div className="w-full aspect-square bg-color-gray-400 rounded flex items-center justify-center">
					<Icon name="military_tech" customClass="!text-[120px] text-color-gray-200 animate-pulse" fill={1} />
				</div>
			</div>
			<div className="flex justify-end px-2 h-[24px] sm:h-[30px] bg-color-gray-400 rounded mx-2 mb-2 animate-pulse" style={{ width: '60px', marginLeft: 'auto' }} />
		</div>
	);
};

interface MedalListSkeletonProps {
	maxHeight: string;
}

const MedalListSkeleton: React.FC<MedalListSkeletonProps> = ({ maxHeight }) => {
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

import { useFontLoadingContext } from '../contexts/useFontLoadingContext';
import Spinner from './Loaders/Spinner';

interface IconProps {
	name: string;
	customClass?: string;
	customStyle?: object;
	fill?: number;
	wght?: number;
	grad?: number;
	opsz?: number;
	toggleRef?: React.MutableRefObject<null>;
	onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
	onMouseOver?: React.MouseEventHandler<HTMLSpanElement> | undefined;
	onMouseLeave?: React.MouseEventHandler<HTMLSpanElement> | undefined;
	key?: string | number;
	iconKey?: string;
	'aria-hidden'?: boolean | 'true' | 'false';
}

const Icon: React.FC<IconProps> = ({
	name,
	customClass,
	customStyle = {},
	fill = 1,
	wght = 400,
	grad = 0,
	opsz = 24,
	toggleRef,
	onClick,
	onMouseOver,
	onMouseLeave,
	iconKey,
	'aria-hidden': ariaHidden = true,
}) => {
	const { fontsLoaded } = useFontLoadingContext() as { fontsLoaded: boolean };

	if (!fontsLoaded) {
		return (
			<span
				key={iconKey}
				className={"invisible" + (customClass ? ' ' + customClass : '')}
			>
				<Spinner size="sm" />
			</span>
		);
	}

	return (
		<span
			ref={toggleRef}
			key={iconKey}
			className={'material-symbols-rounded' + (customClass ? ' ' + customClass : '')}
			style={{
				fontVariationSettings: `'FILL' ${fill}, 'wght' ${wght}, 'GRAD' ${grad}, 'opsz' ${opsz}`,
				...customStyle
			}}
			onClick={onClick}
			onMouseOver={onMouseOver}
			onMouseLeave={onMouseLeave}
			aria-hidden={ariaHidden}
		>
			{name}
		</span>
	);
};

export default Icon;

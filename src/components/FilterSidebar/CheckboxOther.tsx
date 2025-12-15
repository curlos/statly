import classNames from 'classnames';
import Icon from '../Icon';
import { useThemeContext } from '../../contexts/useThemeContext';

interface CheckboxOtherProps {
	name: string;
	showValue: boolean;
	handleCheckboxClick: () => void;
}

const CheckboxOther: React.FC<CheckboxOtherProps> = ({ name, showValue, handleCheckboxClick }) => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	return (
		<div className="flex gap-1 cursor-pointer" onClick={handleCheckboxClick}>
			<Icon
				name={showValue ? 'check_box' : 'check_box_outline_blank'}
				fill={1}
				customClass={classNames('!text-[22px]', chosenColorObj.textColor, nextLightestColorObj.hover.textColor)}
			/>
			<div>{name}</div>
		</div>
	);
};

export default CheckboxOther;

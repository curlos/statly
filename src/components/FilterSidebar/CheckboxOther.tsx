import classNames from 'classnames';
import Icon from '../Icon';
import { useThemeContext } from '../../contexts/useThemeContext';
import { Project } from '../../types/models';

interface CheckboxOtherProps {
	name: string;
	showValue: boolean;
	handleCheckboxClick: () => void;
	project?: Project;
}

const CheckboxOther: React.FC<CheckboxOtherProps> = ({ name, showValue, handleCheckboxClick, project }) => {
	const { chosenColorObj, nextLightestColorObj } = useThemeContext();

	return (
		<div className="flex gap-1 cursor-pointer" onClick={handleCheckboxClick}>
			<Icon
				name={showValue ? 'check_box' : 'check_box_outline_blank'}
				fill={1}
				customClass={classNames('!text-[22px]', chosenColorObj.textColor, (nextLightestColorObj || chosenColorObj).hover.textColor)}
			/>
			<div className="flex-1 flex justify-between">
				<div>{name}</div>
				{project?.color && (
					<div>
						<div className="w-[10px] h-[10px] rounded-full mr-[4px]" style={{ backgroundColor: project?.color }} />
					</div>
				)}
			</div>
		</div>
	);
};

export default CheckboxOther;

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
		<label className="relative flex gap-1 cursor-pointer rounded has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white has-[:focus-visible]:ring-inset">
			<input
				type="checkbox"
				className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
				checked={showValue}
				onChange={handleCheckboxClick}
			/>
			<span aria-hidden="true" className="leading-[0]">
				<Icon
					name={showValue ? 'check_box' : 'check_box_outline_blank'}
					fill={1}
					customClass={classNames('!text-[22px]', chosenColorObj.textColor, (nextLightestColorObj || chosenColorObj).hover.textColor)}
				/>
			</span>
			<span className="flex-1 flex justify-between">
				<span>{name}</span>
				{project?.color && (
					<span aria-hidden="true">
						<span className="block w-[10px] h-[10px] rounded-full mr-[4px]" style={{ backgroundColor: project.color }} />
					</span>
				)}
			</span>
		</label>
	);
};

export default CheckboxOther;

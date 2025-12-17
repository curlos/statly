import classNames from 'classnames';
import Icon from '../Icon';
import type { Project } from '../../types/models';
import type { ColorVariant } from '../../utils/TAILWIND_COLORS/TAILWIND_COLORS_OBJ';

interface CheckboxMultiSelectForUrlProps {
	project?: Project;
	chosenColorObj: ColorVariant;
	nextLightestColorObj: ColorVariant | null;
	commaSeparatedObj: Record<string, boolean>;
	updateQueryParams: (params: Record<string, string>) => void;
	urlQueryParamName: string;
	checkboxId?: string;
	checkboxName?: string;
	nameParentheses?: string;
}

/**
 * @description Checkbox that will update the query params in the URL to either add or remove a project from the "projects" query params.
 */
const CheckboxMultiSelectForUrl: React.FC<CheckboxMultiSelectForUrlProps> = ({
	project,
	chosenColorObj,
	nextLightestColorObj,
	commaSeparatedObj,
	updateQueryParams,
	urlQueryParamName,
	checkboxId,
	checkboxName,
	nameParentheses,
}) => {
	const isProjectOrCategory =
		urlQueryParamName === 'projects' ||
		urlQueryParamName === 'categories' ||
		urlQueryParamName === 'projects-todoist';

	const id = isProjectOrCategory ? project?.id : checkboxId;
	let name = isProjectOrCategory ? project?.name : checkboxName;
	const color = isProjectOrCategory ? project?.color : null;

	// Return early if id is undefined
	if (!id) {
		return null;
	}

	// TODO: Change this to also check for DB value possibly.
	const isChecked = commaSeparatedObj[id];

	if (nameParentheses) {
		name += nameParentheses;
	}

	return (
		<div
			className="flex items-center gap-1 cursor-pointer"
			onClick={() => {
				if (isChecked) {
					commaSeparatedObj[id] = false;
				} else {
					commaSeparatedObj[id] = true;
				}

				const commaSeparatedSelectedValues = getCommaSeparatedSelectedValues(commaSeparatedObj);
				updateQueryParams({ [urlQueryParamName]: commaSeparatedSelectedValues, page: '' });
			}}
		>
			<Icon
				name={isChecked ? 'check_box' : 'check_box_outline_blank'}
				fill={1}
				customClass={classNames('!text-[22px]', chosenColorObj.textColor, nextLightestColorObj?.hover.textColor)}
			/>
			<div className="flex-1 flex justify-between items-center gap-1">
				<div>{name}</div>
				{color && (
					<div>
						<div className="w-[10px] h-[10px] rounded-full mr-[4px]" style={{ backgroundColor: color }} />
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * @description Using "projectsFromUrlById", this will check all of the project ids that are checked and will create a comma separated string from this passed-in object. Mostly meant to update the query params of "projects" with this string.
 * @returns {String}
 */
const getCommaSeparatedSelectedValues = (projectsFromUrlById: Record<string, boolean>) => {
	const selectedProjectsArr: string[] = [];

	for (const projectId of Object.keys(projectsFromUrlById)) {
		const isChecked = projectsFromUrlById[projectId];

		if (isChecked) {
			selectedProjectsArr.push(projectId);
		}
	}

	return selectedProjectsArr.join(',');
};

export default CheckboxMultiSelectForUrl;

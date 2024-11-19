import classNames from 'classnames';
import Icon from '../../../../components/Icon';
import { getProjectProperty, isSessionAppProject } from '../../../../utils/focus-apps/multiFocusApps.utils';

interface CheckboxMultiSelectForUrlProps {
	project?: object;
	chosenColorObj: object;
	nextLightestColorObj: object;
	commaSeparatedObj: object;
	updateQueryParams: () => void;
	urlQueryParamName: string;
	checkboxName?: string;
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
	checkboxName,
}) => {
	const isProjectOrCategory = urlQueryParamName === 'projects' || urlQueryParamName === 'categories';

	const id = isProjectOrCategory ? getProjectProperty(project, 'id') : checkboxName;
	const name = isProjectOrCategory ? getProjectProperty(project, 'name') : checkboxName;
	const color = isProjectOrCategory ? getProjectProperty(project, 'color') : null;

	const isChecked = commaSeparatedObj[id];

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
				customClass={classNames('!text-[22px]', chosenColorObj.textColor, nextLightestColorObj.hover.textColor)}
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
const getCommaSeparatedSelectedValues = (projectsFromUrlById) => {
	const selectedProjectsArr = [];

	for (let projectId of Object.keys(projectsFromUrlById)) {
		const isChecked = projectsFromUrlById[projectId];

		if (isChecked) {
			selectedProjectsArr.push(projectId);
		}
	}

	return selectedProjectsArr.join(',');
};

export default CheckboxMultiSelectForUrl;

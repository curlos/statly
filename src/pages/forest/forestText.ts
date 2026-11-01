import { getFormattedDuration } from '../../utils/helpers.utils';
import type { ForestTree } from './forestLayout';
import { getSpokenDuration, getTreeDisplayName } from './forestTrees';

export interface TreeText {
	title: string;
	// One line for each project in the record, biggest first. Empty when the record only has one project.
	projectLines: string[];
	details: string;
	treeLabel: string;
	// Everything in the tooltip as one sentence, for screen readers
	description: string;
}

const longDayFormat = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// The words for one tree's tooltip and screen reader announcement. Formatting dates is slow, so this is only run for the tree being shown and never for the whole forest.
export const describeTree = (tree: ForestTree, getProjectName: (projectId: string) => string): TreeText => {
	const projectName = getProjectName(tree.projectId);
	const day = longDayFormat.format(new Date(tree.startTime));
	const treeLabel = getTreeDisplayName(tree.treeName);

	// Every project that had time in this record, biggest first. The record's tree comes from the first one.
	const projectsInRecord = Object.entries(tree.projectSeconds)
		.map(([projectId, seconds]) => ({ name: getProjectName(projectId), seconds }))
		.sort((a, b) => b.seconds - a.seconds);
	const hasSeveralProjects = projectsInRecord.length > 1;

	return {
		title: projectName,
		projectLines: hasSeveralProjects ? projectsInRecord.map(({ name, seconds }) => `${name} · ${getFormattedDuration(seconds, false)}`) : [],
		details: `${getFormattedDuration(tree.seconds, false)} · ${day}`,
		treeLabel,
		description: `${
			hasSeveralProjects ? projectsInRecord.map(({ name, seconds }) => `${name} ${getSpokenDuration(seconds)}`).join(' and ') : projectName
		}, ${getSpokenDuration(tree.seconds)}${hasSeveralProjects ? ' in total' : ''}, ${day}, ${treeLabel}`,
	};
};

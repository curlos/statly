import { describe, expect, it, jest } from '@jest/globals';
import { renderToStaticMarkup } from 'react-dom/server';
import GeneralSelectButtonAndDropdown from './GeneralSelectButtonAndDropdown';

// The icon pulls in the app's font loading, and the theme comes from the app's providers; neither matters here
jest.mock('../../../components/Icon', () => ({ __esModule: true, default: () => null }));
jest.mock('./DropdownGeneralSelect', () => ({ __esModule: true, default: () => null }));
jest.mock('../../../contexts/useThemeContext', () => ({
	useThemeContext: () => ({
		chosenColorObj: { hover: { textColor: 'hover:text-x', borderColor: 'hover:border-x' } },
	}),
}));

const render = (selected: string) =>
	renderToStaticMarkup(
		<GeneralSelectButtonAndDropdown
			selected={selected}
			setSelected={() => undefined}
			selectedOptions={['Most → Least', 'Least → Most']}
		/>
	);

describe('GeneralSelectButtonAndDropdown', () => {
	it('keeps a multi-word label like "Most → Least" on one line', () => {
		const html = render('Most → Least');

		expect(html).toContain('<span>Most → Least</span>');
		expect(html).toContain('whitespace-nowrap');
	});

	it('starts closed and names the current option for screen readers', () => {
		const html = render('Least → Most');

		expect(html).toContain('aria-expanded="false"');
		expect(html).toContain('aria-label="Select option, currently: Least → Most"');
	});
});

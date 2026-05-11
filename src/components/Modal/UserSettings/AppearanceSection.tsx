import { useState } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import ThemeColorList from '../../SidebarModal/ThemeColorList';
import FontFamilyList from '../../SidebarModal/FontFamilyList';
import ColorModeList from '../../SidebarModal/ColorModeList';
import classNames from 'classnames';

const AppearanceSection = () => {
	const [activeTab, setActiveTab] = useState<'theme-color' | 'font-family' | 'color-mode'>('theme-color');
	const { chosenColorObj } = useThemeContext();
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[14px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-bold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-25 bg-color-gray-300`;

	return (
		<div>
			{/* Tabs */}
			<div role="tablist" aria-label="Appearance settings" className="flex justify-center gap-2 mb-6">
				<button
					role="tab"
					id="appearance-theme-color-tab"
					aria-selected={activeTab === 'theme-color'}
					aria-controls="appearance-tab-panel"
					className={activeTab === 'theme-color' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('theme-color')}
				>
					Theme Color
				</button>
				<button
					role="tab"
					id="appearance-font-family-tab"
					aria-selected={activeTab === 'font-family'}
					aria-controls="appearance-tab-panel"
					className={activeTab === 'font-family' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('font-family')}
				>
					Font Family
				</button>
				<button
					role="tab"
					id="appearance-color-mode-tab"
					aria-selected={activeTab === 'color-mode'}
					aria-controls="appearance-tab-panel"
					className={activeTab === 'color-mode' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('color-mode')}
				>
					Color Mode
				</button>
			</div>

			{/* Tab Content */}
			<div
				id="appearance-tab-panel"
				role="tabpanel"
				aria-labelledby={`appearance-${activeTab}-tab`}
			>
				{activeTab === 'theme-color' && <ThemeColorList />}
				{activeTab === 'font-family' && <FontFamilyList />}
				{activeTab === 'color-mode' && <ColorModeList />}
			</div>
		</div>
	);
};

export default AppearanceSection;

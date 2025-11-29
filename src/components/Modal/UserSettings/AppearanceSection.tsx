import { useState } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import ThemeColorList from '../../SidebarModal/ThemeColorList';
import FontFamilyList from '../../SidebarModal/FontFamilyList';
import classNames from 'classnames';

const AppearanceSection = () => {
	const [activeTab, setActiveTab] = useState<'theme-color' | 'font-family'>('theme-color');
	const { chosenColorObj } = useThemeContext();
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[14px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-bold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-100 bg-color-gray-300`;

	return (
		<div>
			{/* Tabs */}
			<div className="flex justify-center gap-2 mb-6">
				<div
					className={activeTab === 'theme-color' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('theme-color')}
				>
					Theme Color
				</div>
				<div
					className={activeTab === 'font-family' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('font-family')}
				>
					Font Family
				</div>
			</div>

			{/* Tab Content */}
			<div>
				{activeTab === 'theme-color' && <ThemeColorList />}
				{activeTab === 'font-family' && <FontFamilyList />}
			</div>
		</div>
	);
};

export default AppearanceSection;

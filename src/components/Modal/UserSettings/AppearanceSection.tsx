import { useState } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import ThemeColorList from '../../SidebarModal/ThemeColorList';
import FontFamilyList from '../../SidebarModal/FontFamilyList';
import classNames from 'classnames';

const AppearanceSection = () => {
	const [activeTab, setActiveTab] = useState<'theme-color' | 'font-family' | 'color-mode'>('theme-color');
	const { chosenColorObj, colorMode, toggleColorMode } = useThemeContext();
	const { textColor, bgColorHalfOpacity } = chosenColorObj;

	const sharedButtonStyle = `text-[14px] py-1 px-3 rounded-3xl cursor-pointer`;
	const selectedButtonStyle = classNames(bgColorHalfOpacity, textColor, `${sharedButtonStyle} font-bold`);
	const unselectedButtonStyle = `${sharedButtonStyle} text-color-gray-25 bg-color-gray-300`;

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
				<div
					className={activeTab === 'color-mode' ? selectedButtonStyle : unselectedButtonStyle}
					onClick={() => setActiveTab('color-mode')}
				>
					Color Mode
				</div>
			</div>

			{/* Tab Content */}
			<div>
				{activeTab === 'theme-color' && <ThemeColorList />}
				{activeTab === 'font-family' && <FontFamilyList />}
				{activeTab === 'color-mode' && (
					<div className="flex flex-col items-center gap-4">
						<p className="text-color-gray-25 text-[14px]">
							Choose between dark and light mode. Defaults to your system preference.
						</p>
						<div className="flex gap-3">
							<div
								className={classNames(
									'flex flex-col items-center gap-2 px-6 py-4 rounded-xl cursor-pointer border-2 transition-colors',
									colorMode === 'dark'
										? classNames('border-current', textColor, bgColorHalfOpacity)
										: 'border-color-gray-300 bg-color-gray-300'
								)}
								onClick={() => colorMode !== 'dark' && toggleColorMode()}
							>
								<span className="text-2xl">🌙</span>
								<span className={classNames('text-[14px] font-bold', colorMode === 'dark' ? textColor : 'text-color-gray-25')}>
									Dark
								</span>
							</div>
							<div
								className={classNames(
									'flex flex-col items-center gap-2 px-6 py-4 rounded-xl cursor-pointer border-2 transition-colors',
									colorMode === 'light'
										? classNames('border-current', textColor, bgColorHalfOpacity)
										: 'border-color-gray-300 bg-color-gray-300'
								)}
								onClick={() => colorMode !== 'light' && toggleColorMode()}
							>
								<span className="text-2xl">☀️</span>
								<span className={classNames('text-[14px] font-bold', colorMode === 'light' ? textColor : 'text-color-gray-25')}>
									Light
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default AppearanceSection;

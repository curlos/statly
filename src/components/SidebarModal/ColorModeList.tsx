import classNames from 'classnames';
import { useThemeContext } from '../../contexts/useThemeContext';

const ColorModeList = () => {
	const { chosenColorObj, savedColorMode: colorMode, toggleColorMode } = useThemeContext();
	const { borderColor, bgColor } = chosenColorObj;

	return (
		<div className="flex flex-col items-center gap-4">
			<p className="text-color-gray-25 text-[14px]">
				Choose between dark and light mode. Defaults to your system preference.
			</p>
			<div className="flex gap-3">
				<button
					type="button"
					aria-label="Dark mode"
					aria-pressed={colorMode === 'dark'}
					className={classNames(
						'flex flex-col items-center gap-2 px-6 py-4 rounded-xl cursor-pointer border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
						colorMode === 'dark'
							? classNames(borderColor, bgColor)
							: 'border-color-gray-300 bg-color-gray-300'
					)}
					onClick={() => colorMode !== 'dark' && toggleColorMode()}
				>
					<span className="text-2xl" aria-hidden="true">🌙</span>
					<span className={classNames('text-[14px] font-bold', colorMode === 'dark' ? '' : 'text-color-gray-25')}>
						Dark
					</span>
				</button>
				<button
					type="button"
					aria-label="Light mode"
					aria-pressed={colorMode === 'light'}
					className={classNames(
						'flex flex-col items-center gap-2 px-6 py-4 rounded-xl cursor-pointer border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
						colorMode === 'light'
							? classNames(borderColor, bgColor)
							: 'border-color-gray-300 bg-color-gray-300'
					)}
					onClick={() => colorMode !== 'light' && toggleColorMode()}
				>
					<span className="text-2xl" aria-hidden="true">☀️</span>
					<span className={classNames('text-[14px] font-bold', colorMode === 'light' ? '' : 'text-color-gray-25')}>
						Light
					</span>
				</button>
			</div>
		</div>
	);
};

export default ColorModeList;

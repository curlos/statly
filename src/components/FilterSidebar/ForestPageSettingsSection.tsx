import { useId } from 'react';
import { useUserSettingsContext } from '../../pages/focus-records/useUserSettingsContext';
import { useEditUserSettingsMutation } from '../../services/resources/userSettingsApi';

const HEMISPHERE_OPTIONS = [
	{ value: 'auto', label: 'Automatic', description: "Guessed from your device's time zone" },
	{ value: 'northern', label: 'Northern', description: 'Summer in July, winter in December' },
	{ value: 'southern', label: 'Southern', description: 'Summer in December, winter in July' },
] as const;

const ForestPageSettingsSection = () => {
	const {
		forestPageSettings: { hemisphere },
	} = useUserSettingsContext();
	const [editUserSettings] = useEditUserSettingsMutation();
	const groupName = useId();

	return (
		<div>
			<h3 className="text-[16px] font-bold">Page Settings</h3>

			<fieldset className="mt-3 p-0 border-0">
				<legend className="text-[14px] font-semibold text-color-gray-100 mb-1">Hemisphere</legend>
				<p className="m-0 mb-2 text-[13px] text-color-gray-50">Flips the seasons for the Auto and Seasons land.</p>

				<div className="flex flex-col gap-2">
					{HEMISPHERE_OPTIONS.map(({ value, label, description }) => (
						<label key={value} className="flex items-start gap-2 cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white rounded">
							<input
								type="radio"
								name={groupName}
								className="mt-1 cursor-pointer"
								checked={hemisphere === value}
								onChange={() => editUserSettings({ 'pages.forest.hemisphere': value })}
							/>
							<span>
								<span className="block">{label}</span>
								<span className="block text-[13px] text-color-gray-50">{description}</span>
							</span>
						</label>
					))}
				</div>
			</fieldset>
		</div>
	);
};

export default ForestPageSettingsSection;

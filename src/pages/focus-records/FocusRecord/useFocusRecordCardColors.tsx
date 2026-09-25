import type { CSSProperties } from 'react';
import { useThemeContext } from '../../../contexts/useThemeContext';
import { getReadableTextColor, getHalfOpacityFillColor, getMutedTextPercent } from '../../../utils/color.utils';

interface CustomDisplay {
    useBackgroundColor: boolean;
    backgroundColor: string;
    useTextColor: boolean;
    textColor: string;
    useBackgroundImage: boolean;
    backgroundImage: string;
    backgroundImageOpacity: number;
}

interface ChosenColorObj {
    hexColor: string;
}

interface UseFocusRecordCardColorsParams {
    customDisplay: CustomDisplay;
    chosenColorObj: ChosenColorObj;
    lowerOpacity?: boolean;
}

export const useFocusRecordCardColors = ({ customDisplay, chosenColorObj, lowerOpacity = false }: UseFocusRecordCardColorsParams) => {
    const { colorMode, uiTheme } = useThemeContext();
    const getCardBackgroundStyle = () => {
        if (customDisplay.useBackgroundColor) {
            return { backgroundColor: customDisplay.backgroundColor };
        }
        return {};
    };

    const getBackgroundImageStyle = () => {
        if (customDisplay.useBackgroundImage && customDisplay.backgroundImage) {
            return {
                backgroundImage: `url(${customDisplay.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: customDisplay.backgroundImageOpacity,
            };
        }
        return {};
    };

    const getCardBgColor = () => {
        // Use theme only if no custom background
        if (customDisplay.useBackgroundColor) {
            return customDisplay.backgroundColor
        }

        return chosenColorObj.hexColor
    };

    // The color the card actually shows behind its text
    const getCardFillColor = () => {
        if (customDisplay.useBackgroundImage) {
            return '#000000'
        }
        if (customDisplay.useBackgroundColor) {
            return customDisplay.backgroundColor
        }
        // Game UI theme cards are panels instead of theme-colored fills: cream for Persona 4's
        // light look, dark for the rest (Ink & Marker keeps the theme-colored fill, textured like Copic marker)
        if (uiTheme === 'p4') {
            return '#fff7c2'
        }
        if (uiTheme !== 'default' && uiTheme !== 'ink-marker') {
            return '#1d1c18'
        }
        return lowerOpacity ? getHalfOpacityFillColor(chosenColorObj.hexColor, colorMode) : chosenColorObj.hexColor
    };

    const getCardTextColor = () => {
        if (customDisplay.useTextColor) {
            return customDisplay.textColor
        }
        if (customDisplay.useBackgroundImage) {
            return colorMode === 'dark' ? 'white' : 'black'
        }
        return getReadableTextColor(getCardFillColor())
    };

    const cardTextColor = getCardTextColor()
    const mutedTextPercent = getMutedTextPercent(cardTextColor, getCardFillColor())
    const cardBackgroundStyle: CSSProperties & Record<`--${string}`, string> = {
        ...getCardBackgroundStyle(),
        color: cardTextColor,
        '--muted-text-percent': `${mutedTextPercent}%`,
    }
    const backgroundImageStyle = getBackgroundImageStyle()
    const cardBgColor = getCardBgColor()

    return {
        cardBackgroundStyle,
        backgroundImageStyle,
        cardBgColor,
        cardTextColor
    }
}

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
}

export const useFocusRecordCardColors = ({ customDisplay, chosenColorObj }: UseFocusRecordCardColorsParams) => {
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

    const getCardTextColor = () => {
        // Use theme only if no custom background
        if (customDisplay.useTextColor) {
            return customDisplay.textColor
        }
        return 'white'
    };

    const cardBackgroundStyle = getCardBackgroundStyle()
    const backgroundImageStyle = getBackgroundImageStyle()
    const cardBgColor = getCardBgColor()
    const cardTextColor = getCardTextColor()

    return {
        cardBackgroundStyle,
        backgroundImageStyle,
        cardBgColor,
        cardTextColor
    }
}

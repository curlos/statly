import ReactMarkdown from "react-markdown";
import { formatDateTime, getFormattedLongDay, getFormattedShortMonthDay } from "../../../utils/date.utils";
import Icon from "../../../components/Icon";
import LazyImage from "../../../components/LazyImage";
import classNames from "classnames";
import { useThemeContext } from "../../../contexts/useThemeContext";
import { useSearchParamsContext } from "../../../contexts/useSearchParamsContext";
import { useUserSettingsContext } from "../useUserSettingsContext";
import { getFormattedDuration, getMedalImageClasses } from "../../../utils/helpers.utils";
import { BATTLEFIELD_1_MEDALS_BY_URL, BATTLEFIELD_3_MEDALS_BY_URL } from "../../medals/medalsLinks";
import EmotionTag from "../../../components/EmotionTag";
import { useHandleEmotionTagClick } from "../useHandleEmotionTagClick";
import FocusRecordContextMenu from "../../../components/FocusRecordContextMenu";
import ModalConfirmDelete from "../../../components/Modal/ModalConfirmDelete";
import Dropdown from "../../../components/Dropdown/Dropdown";
import FocusRecordTasks from "./FocusRecordTasks";
import { useFocusRecordMenu } from "./useFocusRecordMenu";
import FocusRecordMenuItems from "../../../components/FocusRecordMenuItems";
import type { FocusRecord, Emotion, Task } from "../../../types/models";
import { useFocusRecordCardColors } from "./useFocusRecordCardColors";

interface FocusRecordProps {
    focusRecord: FocusRecord;
    isLastItemForTheDay?: boolean;
    pendingFocusIdRef?: React.MutableRefObject<string | null>;
}

const FocusRecord: React.FC<FocusRecordProps> = ({ focusRecord, isLastItemForTheDay = false, pendingFocusIdRef }) => {
    const { buildUrlWithQueryParams } = useSearchParamsContext();
    const { startTime, endTime, duration, note, crossesMidnight } = focusRecord;

    const buildDayUrl = (date: Date) => {
        const dayUrl = getFormattedShortMonthDay(date);
        return buildUrlWithQueryParams({ "start-date": dayUrl, "end-date": dayUrl, page: "" });
    };
    const startTimeObj = formatDateTime(startTime);
    const endTimeObj = formatDateTime(endTime);

    const themeContext = useThemeContext();
    const { chosenColorObj, colorMode } = themeContext;
    const { bgColorHalfOpacity, bgColor } = chosenColorObj;

    const {
        focusRecordsPageSettings: {
            showCompletedTasks,
            showFocusNotes,
            showMedals,
            selectedMedalImage,
            medalImageSizePx,
            showMedalGlow,
            showFocusRecordEmotions,
            customDisplay,
        },
    } = useUserSettingsContext();

    // Get completed tasks from API response
    const completedTasksDuringFocusSession = focusRecord.completedTasks || [];
    const thereAreCompletedTasks = completedTasksDuringFocusSession && completedTasksDuringFocusSession.length > 0;

    // Handle emotion tag click
    const { buildEmotionUrl } = useHandleEmotionTagClick();
    const isBattlefieldOneOrThreeMedal = !!(
        BATTLEFIELD_1_MEDALS_BY_URL[selectedMedalImage] || BATTLEFIELD_3_MEDALS_BY_URL[selectedMedalImage]
    );
    const urlRegex = /(https?:\/\/[^\s)]+)/g; // matches http/https URLs

    // Use custom hook for all menu-related logic
    const {
        articleRef,
        contextMenuVisible,
        setContextMenuVisible,
        contextMenuPosition,
        handleContextMenu,
        dropdownOpen,
        setDropdownOpen,
        dropdownToggleRef,
        dropdownOpenMobile,
        setDropdownOpenMobile,
        dropdownToggleRefMobile,
        deleteModalOpen,
        setDeleteModalOpen,
        isDeleting,
        handleDelete,
        menuItems,
    } = useFocusRecordMenu({
        focusRecord,
        completedTasksDuringFocusSession,
        showFocusRecordEmotions,
        pendingFocusIdRef,
    });

    const { cardBackgroundStyle, backgroundImageStyle, cardBgColor, cardTextColor } = useFocusRecordCardColors({ customDisplay, chosenColorObj });

    return (
        <article
            ref={articleRef}
            data-focus-record-id={focusRecord.id}
            className={classNames(
                "m-0 list-none last:mb-[4px] w-full",
                showMedals ? "flex" : "relative",
                showMedals && !isBattlefieldOneOrThreeMedal ? "gap-2" : "",
            )}
            style={{ minHeight: "54px" }}
        >
            {showMedals && (
                <LazyImage
                    src={selectedMedalImage}
                    alt="Medal image"
                    className={getMedalImageClasses(medalImageSizePx, isBattlefieldOneOrThreeMedal, selectedMedalImage)}
                    showGlow={showMedalGlow}
                />
            )}

            {!showMedals && (
                <div className="absolute w-[24px] h-[24px] bg-primary-10 rounded-full flex items-center justify-center">
                    <Icon name="timer" customClass={classNames("!text-[20px]")} customStyle={{ color: cardBgColor }} />
                </div>
            )}

            {!isLastItemForTheDay && !showMedals && (
                <div
                    className={classNames(
                        "absolute top-[28px] left-[11px] h-full border-solid border-l-[1px]",
                    )}
                    style={{ height: "calc(100% - 16px)", borderColor: cardBgColor }}
                ></div>
            )}

            <div
                className={classNames(showMedals ? "w-full" : "ml-[25px] sm:ml-[40px]", "relative m-0 break-words")}
                style={{ marginTop: "unset" }}
            >
                {!isLastItemForTheDay && !showMedals && (
                    <div
                        className={classNames(
                            "absolute left-[-18px] sm:left-[-33px] w-[10px] h-[10px] border-solid rounded-full border-[2px] bg-color-gray-600"
                        )}
                        style={{ top: "34px", borderColor: cardBgColor }}
                    ></div>
                )}

                <div
                    className={classNames("p-2 rounded-lg w-[95%] sm:w-full relative", customDisplay.useBackgroundImage ? 'bg-black' : !customDisplay.useBackgroundColor && (colorMode === 'dark' ? bgColorHalfOpacity : bgColor) )}
                    style={cardBackgroundStyle}
                    onContextMenu={handleContextMenu}
                >
                    {/* Separate background image layer */}
                    {customDisplay.useBackgroundImage && customDisplay.backgroundImage && (
                        <div
                            className="absolute inset-0 rounded-lg"
                            style={{
                                ...backgroundImageStyle,
                                zIndex: 0,
                            }}
                        ></div>
                    )}

                    <div className="hidden sm:flex items-center justify-between relative" style={{ color: cardTextColor }}>
                        <div>
                            <a
                                href={buildDayUrl(new Date(startTime))}
                                className="font-bold hover:underline"
                                style={{ color: cardTextColor }}
                            >
                                {getFormattedLongDay(new Date(startTime))}
                            </a>
                            {crossesMidnight && (
                                <>
                                    {" - "}
                                    <a
                                        href={buildDayUrl(new Date(endTime))}
                                        className="font-bold hover:underline"
                                        style={{ color: cardTextColor }}
                                    >
                                        {getFormattedLongDay(new Date(endTime))}
                                    </a>
                                </>
                            )}
                            {" - "}
                            {startTimeObj.time} - {endTimeObj.time} ({getFormattedDuration(duration, false)})
                        </div>

                        <div className="relative ml-2" ref={dropdownToggleRef}>
                            <button
                                type="button"
                                aria-label="Open record options"
                                aria-expanded={dropdownOpen}
                                aria-haspopup="menu"
                                className="bg-transparent border-0 p-0 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setContextMenuVisible(false);
                                    setDropdownOpen(!dropdownOpen);
                                }}
                            >
                                <Icon
                                    name="more_horiz"
                                    customClass="text-color-gray-50 !text-[20px] hover:text-white transition-colors"
                                    customStyle={{ color: cardTextColor }}
                                />
                            </button>

                            <Dropdown
                                isVisible={dropdownOpen}
                                setIsVisible={setDropdownOpen}
                                toggleRef={dropdownToggleRef}
                                customClasses="min-w-[200px] !text-[14px]"
                                role="menu"
                            >
                                <FocusRecordMenuItems
                                    menuItems={menuItems}
                                    onItemClick={() => setDropdownOpen(false)}
                                />
                            </Dropdown>
                        </div>
                    </div>

                    <div className="sm:hidden relative" style={{ color: cardTextColor }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-bold" style={{ color: cardTextColor }}>
                                    <a
                                        href={buildDayUrl(new Date(startTime))}
                                        className="hover:underline"
                                        style={{ color: cardTextColor }}
                                    >
                                        {getFormattedShortMonthDay(new Date(startTime))}
                                    </a>
                                    {crossesMidnight && (
                                        <>
                                            {" - "}
                                            <a
                                                href={buildDayUrl(new Date(endTime))}
                                                className="hover:underline"
                                                style={{ color: cardTextColor }}
                                            >
                                                {getFormattedShortMonthDay(new Date(endTime))}
                                            </a>
                                        </>
                                    )}
                                </span>
                                <div>
                                    {startTimeObj.time} - {endTimeObj.time} ({getFormattedDuration(duration, false)})
                                </div>
                            </div>

                            <div className="relative ml-2" ref={dropdownToggleRefMobile}>
                                <button
                                    type="button"
                                    aria-label="Open record options"
                                    aria-expanded={dropdownOpenMobile}
                                    aria-haspopup="menu"
                                    className="bg-transparent border-0 p-0 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setContextMenuVisible(false);
                                        setDropdownOpenMobile(!dropdownOpenMobile);
                                    }}
                                >
                                    <Icon
                                        name="more_horiz"
                                        customClass="text-color-gray-50 !text-[20px] hover:text-white transition-colors"
                                    />
                                </button>

                                <Dropdown
                                    isVisible={dropdownOpenMobile}
                                    setIsVisible={setDropdownOpenMobile}
                                    toggleRef={dropdownToggleRefMobile}
                                    customClasses="min-w-[200px] !text-[14px]"
                                    role="menu"
                                >
                                    <FocusRecordMenuItems
                                        menuItems={menuItems}
                                        onItemClick={() => setDropdownOpenMobile(false)}
                                    />
                                </Dropdown>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <FocusRecordTasks focusRecord={focusRecord} cardTextColor={cardTextColor} />
                    </div>

                    {showFocusNotes && (
                        <div
                            className={classNames(
                                "text-color-gray-100 text-[15px] break-words react-markdown relative z-10",
                            )}
                            style={{ color: cardTextColor }}
                        >
                            <ReactMarkdown>{note}</ReactMarkdown>
                        </div>
                    )}

                    {showCompletedTasks && thereAreCompletedTasks && (
                        <div className="relative z-10">
                            <h3 className="text-[16px] font-bold underline mt-4" style={{ color: cardTextColor }}>Completed Tasks</h3>

                            <ul>
                                {completedTasksDuringFocusSession.map((completedTask: Task, index: number) => {
                                    const completedTaskText = completedTask.title;
                                    const containsUrl = completedTaskText?.match(urlRegex);

                                    return (
                                        <li key={`${focusRecord.id}-${index}`} className="flex items-start gap-1">
                                            <Icon
                                                name="check_box"
                                                customClass={classNames("!text-[20px] mt-[2px]")}
                                                customStyle={{ color: cardTextColor }}
                                            />
                                            <span
                                                className={classNames(
                                                    containsUrl
                                                        ? "break-all md:break-normal md:break-words"
                                                        : "break-words",
                                                )}
                                                style={{ color: cardTextColor }}
                                            >
                                                {completedTaskText}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {/* Emotion Tags */}
                    {showFocusRecordEmotions && (
                        <div className="mt-3 relative">
                            <div className="flex flex-wrap gap-2">
                                {focusRecord.emotions && focusRecord.emotions.length > 0 ? (
                                    focusRecord.emotions.map((emotionObj: Emotion, index: number) => (
                                        <EmotionTag
                                            key={`${emotionObj.emotion}-${index}`}
                                            emotionObj={emotionObj}
                                            href={buildEmotionUrl(emotionObj.emotion)}
                                            showScore={true}
                                        />
                                    ))
                                ) : (
                                    <EmotionTag
                                        emotionObj={{ emotion: "none", score: 0 }}
                                        href={buildEmotionUrl("none")}
                                        showScore={false}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Context Menu */}
            <FocusRecordContextMenu
                isVisible={contextMenuVisible}
                position={contextMenuPosition}
                menuItems={menuItems}
                onClose={() => setContextMenuVisible(false)}
            />

            {/* Delete Confirmation Modal */}
            <ModalConfirmDelete
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Focus Record"
                counts={{ focusRecords: 1 }}
                isDeleting={isDeleting}
                showCounts={false}
            />
        </article>
    );
};

export default FocusRecord;

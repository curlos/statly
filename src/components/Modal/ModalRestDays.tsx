import React from 'react';
import Modal from './Modal';
import Icon from '../Icon';
import { getFormattedLongDay } from '../../utils/date.utils';

interface ModalRestDaysProps {
  isOpen: boolean;
  onClose: () => void;
  restDays: { [key: string]: boolean };
}

const ModalRestDays: React.FC<ModalRestDaysProps> = ({
  isOpen,
  onClose,
  restDays,
}) => {
  // Filter and sort logic
  const activeRestDays = Object.entries(restDays || {})
    .filter(([, isRestDay]) => isRestDay === true)
    .map(([dateKey]) => dateKey)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const formatDate = (dateKey: string) => {
    try {
      const dateObj = new Date(dateKey + 'T12:00:00');
      if (isNaN(dateObj.getTime())) throw new Error('Invalid date');
      return getFormattedLongDay(dateObj);
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} customClasses="!max-w-[600px]">
      <div className="bg-color-gray-700 rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Rest Days</h3>
          <button
            onClick={onClose}
            className="text-color-gray-25 hover:text-white transition-colors"
          >
            <Icon name="close" fill={1} customClass="!text-[24px]" />
          </button>
        </div>

        {/* List or Empty State */}
        {activeRestDays.length === 0 ? (
          <div className="text-center py-8 text-color-gray-25">
            <Icon name="event_busy" fill={1} customClass="!text-[48px] mb-2 opacity-50" />
            <p className="text-[14px]">No rest days recorded</p>
          </div>
        ) : (
          <div className="max-h-[500px] overflow-auto gray-scrollbar">
            {activeRestDays.map((dateKey) => (
              <div
                key={dateKey}
                className="p-3 bg-color-gray-600 rounded-lg mb-2"
              >
                <span className="text-[14px] text-white">{formatDate(dateKey)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalRestDays;

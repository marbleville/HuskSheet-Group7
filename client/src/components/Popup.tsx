import React from 'react';
import '../styles/Popup.css'

interface PopupProps {
  message: string;
  onClose: () => void;
}

/**
 * Displays a popup.
 * 
 * @param {Object} - message to display 
 * 
 * @author rishavsarma5
 */
const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
  return (
    <div className="popup-background" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <p className="popup-message">{message}</p>
        <button className="popup-button" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

export default Popup;
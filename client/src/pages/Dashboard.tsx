import { useState, useEffect } from "react";
import fetchWithAuth from "../utils/fetchWithAuth";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { Argument } from "../../../types/types";

/**
 * The dashboard page. Displays all sheets for the current user. 
 * Provides options to create, edit, and delete sheets.
 *
 * @author kris-amerman
 */
function Dashboard() {

  // Dashboard state
  const [username, setUsername] = useState<string>("");
  const [sheetsByPublisher, setSheetsByPublisher] = useState<{ [key: string]: Argument[] }>({});
  const [publishers, setPublishers] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [sheetName, setSheetName] = useState<string>("Untitled Sheet");
  const navigate = useNavigate();

  /**
   * Initializes the dashboard by setting the username and fetching publishers.
   * 
   * @author kris-amerman
   */
  useEffect(() => {
    const currentUser = sessionStorage.getItem("username");
    if (!currentUser) {
      console.error("Username not found in sessionStorage");
      return;
    }
    setUsername(currentUser);
    fetchPublishers(currentUser);
  }, []);

  /**
   * Fetches the list of publishers and initializes their sheet data.
   * Sets the expanded state for each publisher.
   *
   * @param {string} currentUser - The current username.
   * @author kris-amerman
   */
  const fetchPublishers = (currentUser: string) => {
    fetchWithAuth(
      "getPublishers",
      { method: "GET" },
      (data) => {
        const publishers = data.value.map((item: Argument) => item.publisher);
        setPublishers(publishers);
        publishers.forEach((publisher: string) => {
          fetchSheets(publisher);
          // Initialize expanded state to true for the current user and false for others
          setExpanded(prevState => ({ ...prevState, [publisher]: publisher === currentUser }));
        });
      }
    );
  }

  /**
   * Fetches sheets for a given publisher.
   *
   * @param {string} publisher - The publisher whose sheets are to be fetched.
   * @author kris-amerman
   */
  const fetchSheets = (publisher: string) => {
    fetchWithAuth(
      "getSheets",
      { method: "POST", body: JSON.stringify({ publisher }) },
      (data) => {
        setSheetsByPublisher(prevState => ({
          ...prevState,
          [publisher]: data.value
        }));
      }
    );
  };

  /**
   * Handles the deletion of a sheet.
   * 
   * @param {Argument} sheet - The sheet to be deleted.
   * @author kris-amerman
   */
  const handleDeleteSheet = (sheet: Argument) => {
    fetchWithAuth(
      "deleteSheet",
      {
        method: "POST", body: JSON.stringify({
          publisher: sheet.publisher,
          sheet: sheet.sheet
        })
      },
      () => fetchSheets(sheet.publisher)
    );
  };

  /**
   * Handles the creation of a new sheet.
   * Navigates to the new sheet's page upon creation.
   *
   * @author kris-amerman
   */
  const handleCreateSheet = () => {
    const argument = {
      publisher: username,
      sheet: sheetName,
    };
    fetchWithAuth(
      "createSheet",
      { method: "POST", body: JSON.stringify(argument) },
      () => {
        navigate(`/${argument.publisher}/${argument.sheet}`, { state: argument });
      }
    );
  };

  /**
   * Handles navigation to the sheet's page when clicked.
   * 
   * @param {Argument} sheet - The sheet to navigate to.
   * @author kris-amerman
   */
  const handleSheetClick = (sheet: Argument) => {
    navigate(`/${sheet.publisher}/${sheet.sheet}`, { state: sheet });
  };

  /**
   * Toggles the expanded/collapsed state for a given publisher.
   *
   * @param {string} publisher - The publisher whose expand state is to be toggled.
   * @author kris-amerman
   */
  const toggleExpand = (publisher: string) => {
    setExpanded(prevState => ({ ...prevState, [publisher]: !prevState[publisher] }));
  };

  return (
    <div className="wrapper">
      <div className="dashboard-container">
        <p style={{ "fontSize": "28px", "fontWeight": "bold", "color": "#5b5b5d", "marginBottom": "50px" }}>Hello, {username} 👋</p>
        <div className="create-sheet-container">
          <input
            value={sheetName}
            placeholder="Untitled Sheet"
            className="create-sheet-input"
            onChange={(e) => setSheetName(e.target.value)}
          />
          <button onClick={handleCreateSheet} className="create-sheet-button">
            Create new sheet +
          </button>
        </div>
        {publishers
          // move current user's publisher to the top
          .sort((a, b) => (a === username ? -1 : b === username ? 1 : 0))
          .map(publisher => (
            <div key={publisher}>
              <h2 onClick={() => toggleExpand(publisher)} className="publisher-header">
                <span className="chevron-icon">{expanded[publisher] ? "▼" : "►"}</span>
                {publisher}
              </h2>
              {expanded[publisher] && (
                <div className="sheet-buttons-container">
                  {/* everse the sheets array */}
                  {sheetsByPublisher[publisher]?.slice().reverse().map((sheet, index) => (
                    <div key={index} className="sheet-button-container">
                      <button
                        onClick={() => handleSheetClick(sheet)}
                        className="sheet-button"
                      >
                        <p className="sheet-name-text">{sheet.sheet}</p>
                      </button>
                      {/* Only render Delete button if the publisher is the current user */}
                      {sheet.publisher === username && (
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteSheet(sheet)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Dashboard;

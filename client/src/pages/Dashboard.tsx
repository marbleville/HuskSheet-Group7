import { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { Argument } from "../../../types/types";

/**
 * @description The dashboard page. Displays all sheets for the current user. Provides options to create, edit, and delete sheets.
 *
 * @author kris-amerman, rishavsarma5
 */
function Dashboard() {
  const [username, setUsername] = useState<string>("");
  const [sheetsByPublisher, setSheetsByPublisher] = useState<{ [key: string]: Argument[] }>({});
  const [publishers, setPublishers] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [sheetName, setSheetName] = useState<string>("Untitled Sheet");
  const navigate = useNavigate();

  const fetchPublishers = async (currentUser: string) => {
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

  // fetchSheets for a given publisher
  const fetchSheets = async (publisher: string) => {
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

  const handleCreateSheet = async () => {
    const argument = {
      publisher: username,
      sheet: sheetName,
    };
    fetchWithAuth(
      "createSheet",
      { method: "POST", body: JSON.stringify(argument) },
      () => fetchSheets(username) // Refresh sheets after creating a new one
    );
  };

  // Toggle expand/collapse for a publisher
  const toggleExpand = (publisher: string) => {
    setExpanded(prevState => ({ ...prevState, [publisher]: !prevState[publisher] }));
  };

  // Create a new sheet with the on click and load any data that is on the sheet
  const handleSheetClick = (sheet: Argument) => {
    navigate(`/${sheet.sheet}`, { state: sheet });
  };

  useEffect(() => {
    const currentUser = sessionStorage.getItem("username");
    if (!currentUser) {
      console.error("Username not found in sessionStorage");
      return;
    }
    setUsername(currentUser);
    fetchPublishers(currentUser);
  }, []);

  return (
    <div className="wrapper">
      <div className="dashboard-container">
        <p style={{"fontSize": "28px", "fontWeight": "bold", "color": "#5b5b5d", "marginBottom": "50px"}}>Hello, {username} 👋</p>
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
          .sort((a, b) => (a === username ? -1 : b === username ? 1 : 0)) // Move current user's publisher to the top
          .map(publisher => (
            <div key={publisher}>
              <h2 onClick={() => toggleExpand(publisher)} className="publisher-header">
                <span className="chevron-icon">{expanded[publisher] ? "▼" : "►"}</span>
                {publisher}
              </h2>
              {expanded[publisher] && (
                <div className="sheet-buttons-container">
                  {sheetsByPublisher[publisher]?.slice().reverse().map((sheet, index) => ( // Reverse the sheets array
                    <div key={index} className="sheet-button-container">
                      <button
                        onClick={() => handleSheetClick(sheet)}
                        className="sheet-button"
                      >
                        <p className="sheet-name-text">{sheet.sheet}</p>
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteSheet(sheet)}
                      >
                        Delete
                      </button>
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

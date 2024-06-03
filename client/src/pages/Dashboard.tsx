import { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

interface SheetResponse {
  publisher: string;
  id: string;
  sheet: string;
  payload: string;
}

/**
 * @description The dashboard page. Displays all sheets for the current user. Provides options to create, edit, and delete sheets.
 * 
 * @author kris-amerman, rishavsarma5
 */
function Dashboard() {
  const [sheets, setSheets] = useState<SheetResponse[]>([]);

  const fetchData = async () => {
    const username = sessionStorage.getItem("username");
    if (!username) {
      console.error("Username not found in sessionStorage");
      return;
    }

    const argument = { publisher: username };

    fetchWithAuth(
      "http://localhost:3000/api/v1/getSheets",
      { method: "POST", body: JSON.stringify(argument) },
      (data) => setSheets(data.value)
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const navigate = useNavigate();

  // Create a new sheet with the on click and load any data that is on the sheet
  const handleSheetClick = (sheet: SheetResponse) => {
    // Placeholder handler for clicking on a sheet name
    
    //console.log("Clicked on sheet:", sheet.sheet);
    //alert("Clicked on sheet: " + sheet.sheet);
    navigate(`/${sheet.sheet}`, { state: sheet });
  };

  const handleCreateSheet = async () => {
    const username = sessionStorage.getItem("username");
    if (!username) {
      console.error("Username not found in sessionStorage");
      return;
    }

    const argument = {
      publisher: username,
      sheet: "Untitled Sheet", // "Untitled Sheet" for now
    };

    fetchWithAuth(
      "http://localhost:3000/api/v1/createSheet",
      { method: "POST", body: JSON.stringify(argument) },
      () => fetchData() // Refresh sheets after creating a new one
    );
  };

  return (
    <div className="dashboard-container">
      <div className="sheet-buttons-container">
        {sheets.map((sheet, index) => (
          <button
            key={index}
            onClick={() => handleSheetClick(sheet)}
            className="sheet-button"
          >
            {sheet.sheet}
          </button>
        ))}
      </div>
      <button onClick={handleCreateSheet} className="create-sheet-button">
        Create new sheet
      </button>
    </div>
  );
}

export default Dashboard;

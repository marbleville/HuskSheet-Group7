import { useState, useEffect } from "react";
import { fetchWithAuth } from "../utils";

/**
 * @author kris-amerman
 * @description The dashboard page. Displays all sheets for the current user. Provides options to create, edit, and delete sheets.
 */

interface SheetResponse {
  publisher: string;
  id: string;
  sheet: string;
  payload: string;
}

function Dashboard() {
  const [sheets, setSheets] = useState<SheetResponse[]>([]);

  

  const setUsername = () => {
    return sessionStorage.getItem('username');
  };

  const publisherName: string | null = setUsername();

  const fetchData = async () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('Username not found in sessionStorage');
      return;
    }

    const argument = { publisher: username };

    fetchWithAuth(
      'http://localhost:3000/api/v1/getSheets',
      { method: 'POST', body: JSON.stringify(argument) },
      (data) => setSheets(data.value)
    );

  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSheetClick = (sheet: SheetResponse) => {
    // Placeholder handler for clicking on a sheet name
    console.log("Clicked on sheet:", sheet.sheet);
    alert("Clicked on sheet: " + sheet.sheet);
  };

  const handleCreateSheet = async () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('Username not found in sessionStorage');
      return;
    }

    const argument = {
      publisher: username,
      sheet: "Untitled Sheet" // "Untitled Sheet" for now
    };

    fetchWithAuth(
      'http://localhost:3000/api/v1/createSheet',
      { method: 'POST', body: JSON.stringify(argument) },
      () => fetchData() // Refresh sheets after creating a new one
    );
  };

  

  return (
    <div>
      <h1>Dashboard, Welcome {publisherName}</h1>
      <div>
        {sheets.map((sheet, index) => (
          <button key={index} onClick={() => handleSheetClick(sheet)}>
            {sheet.sheet}
          </button>
        ))}
      </div>
      <button onClick={handleCreateSheet}>Create new sheet</button>
    </div>
  );
}

export default Dashboard;
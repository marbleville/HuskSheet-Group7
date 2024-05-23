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

  const fetchData = async () => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      console.error('Username not found in sessionStorage');
      return;
    }

    const argument = {
      publisher: username
    };

    try {
      const response = await fetchWithAuth('http://localhost:3000/api/v1/getSheets', {
        method: 'POST',
        body: JSON.stringify(argument)
      });
      if (response.ok) {
        const data = await response.json();
        const value = data.value;
        setSheets(value); 
      } else {
        console.error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error fetching', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSheetClick = (sheet: SheetResponse) => {
    // Placeholder handler for clicking on a sheet name
    console.log("Clicked on sheet:", sheet.sheet);
    alert("Clicked on sheet: " + sheet.sheet);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        {sheets.map((sheet, index) => (
          <button key={index} onClick={() => handleSheetClick(sheet)}>
            {sheet.sheet}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
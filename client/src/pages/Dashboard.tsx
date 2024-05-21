import { useEffect } from "react"
import { fetchWithAuth } from "../utils";


/**
 * @author kris-amerman
 * @description The dashboard page. Displays all sheets for the current user. Provides options to create, edit, and delete sheets.
 */
function Dashboard() {

  const fetchData = async () => {
    try {
      const response = await fetchWithAuth('http://localhost:3000/api/v1/getSheets');
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Failed to fetch');
      }
    } catch (error) {
      console.error('Error fetching', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}

export default Dashboard
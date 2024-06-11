import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Cell from "./Cell";
import { fetchWithAuth, getHeaderLetter } from "../utils";
import "../styles/Sheet.css";
import { Argument } from "../../../types/types";
import SheetUpdateHandler from "../sheetUpdateHandler";
import Popup from "./Popup";

// Constants
const INITIALSHEETROWSIZE = 10;
const INITIALSHEETCOLUMNSIZE = 10;

// Represents the client's relationship to this sheet.
type SheetRelationship = "OWNER" | "SUBSCRIBER";

// Represents data stored in the sheet as a mapping of REF:TERM pairs. 
interface SheetDataMap {
  [ref: string]: string;
}

/**
 * @description Initializes the SheetDataMap based on given row/columns.
 *
 * @author rishavsarma5
 */
const initializeSheet = (rowSize: number, colSize: number): SheetDataMap => {
  const initialData: SheetDataMap = {};

  for (let i = 1; i <= rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      const columnValue: string = getHeaderLetter(j);
      const ref = `$${columnValue}${i}`;
      initialData[ref] = "";
    }
  }

  return initialData;
};


/**
 * @description A Sheet that manages the data of its child Cells.
 *
 * @author kris-amerman, rishavsarma5, eduardo-ruiz-garay
 */
const Sheet: React.FC = () => {

  // Receive contextual information about sheet from the dashboard page.
  const location = useLocation();
  const sheetInfo: Argument = location.state;

  // Initialize the SheetDataMap.
  const initialSheetData: SheetDataMap = initializeSheet(
    INITIALSHEETROWSIZE,
    INITIALSHEETCOLUMNSIZE
  );

  // Sheet state.
  const [sheetData, setSheetData] = useState<SheetDataMap>(initialSheetData);
  const [manualUpdates, setManualUpdates] = useState<Set<string>>(new Set());
  const prevCellDataRef = useRef<SheetDataMap>({ ...sheetData });
  const [numRows, setNumRows] = useState(INITIALSHEETROWSIZE);
  const [numCols, setNumCols] = useState(INITIALSHEETCOLUMNSIZE);
  const [sheetRelationship, setSheetRelationship] = useState<SheetRelationship>();
  const [latestUpdateID, setLatestUpdateID] = useState<string>("0");
  const [incomingUpdates, setIncomingUpdates] = useState<SheetDataMap>({});
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  // Store client's relationship to this sheet based on username and sheet publisher.
  useEffect(() => {
    if (sheetInfo.publisher === sessionStorage.getItem("username")) {
      setSheetRelationship("OWNER")
    } else {
      setSheetRelationship("SUBSCRIBER")
    }
  }, [])

  /**
   * @description Updates the sheetData when a cell's input changes.
   *
   * @author rishavsarma5, eduardo-ruiz-garay, kris-amerman
   */
  const handleCellUpdate = (value: string, cellId: string) => {
    setSheetData((prevSheetData) => {
      const updatedSheetData = { ...prevSheetData, [cellId]: value };
      
      // Record the previous value for comparison
      prevCellDataRef.current = {
        ...prevCellDataRef.current,
        [cellId]: prevSheetData[cellId],
      };
      
      // If the value is different from the previous one, or if the value is empty, mark it as manually updated
      if (value !== prevSheetData[cellId] || value === "") {
        setManualUpdates((prevManualUpdates) => {
          const newManualUpdates = new Set(prevManualUpdates);
          newManualUpdates.add(cellId);
          return newManualUpdates;
        });
      }
  
      return updatedSheetData;
    });
  };

  /**
   * @description Add a new empty row.
   *
   * @author rishavsarma5
   */
  const addNewRow = () => {
    setNumRows((prevNumRows) => prevNumRows + 1);

    const newSheetData = { ...sheetData };
    const newRowNumber = numRows + 1;

    for (let col = 0; col < numCols; col++) {
      const colLetter = getHeaderLetter(col);
      const cellID = `$${colLetter}${newRowNumber}`;
      newSheetData[cellID] = "";
      prevCellDataRef.current[cellID] = "";
      setManualUpdates((prevManualUpdates) => {
        const newManualUpdates = new Set(prevManualUpdates);
        newManualUpdates.add(cellID);
        return newManualUpdates;
      });
    }

    setSheetData(newSheetData);
  };

  /**
   * @description Delete a row.
   *
   * @author rishavsarma5
   */
  const deleteRow = () => {
    if (numRows === 1) {
      return;
    }

    const lastRowNumber = numRows;

    for (let col = 0; col < numCols; col++) {
      const colLetter = getHeaderLetter(col);
      const cellID = `$${colLetter}${lastRowNumber}`;
      if (sheetData[cellID] !== "") {
        handleCellUpdate("", cellID);
      }
    }

    setNumRows((prevNumRows) => prevNumRows - 1);
  };

  /**
   * @description Add a new empty column.
   *
   * @author rishavsarma5
   */
  const addNewCol = () => {
    setNumCols((prevNumCols) => prevNumCols + 1);

    const newSheetData = { ...sheetData };
    const newColumnLetter = getHeaderLetter(numCols);

    for (let row = 1; row <= numRows; row++) {
      const cellID = `$${newColumnLetter}${row}`;
      newSheetData[cellID] = "";
      setManualUpdates((prevManualUpdates) => {
        const newManualUpdates = new Set(prevManualUpdates);
        newManualUpdates.add(cellID);
        return newManualUpdates;
      });
    }

    setSheetData(newSheetData);
  };

  /**
   * @description Delete a column.
   *
   * @author rishavsarma5
   */
  const deleteCol = () => {
    if (numCols === 1) {
      return;
    }

    const lastColumnLetter = getHeaderLetter(numCols);

    for (let row = 1; row <= numRows; row++) {
      const cellID = `$${lastColumnLetter}${row}`;
      if (sheetData[cellID] !== "") {
        handleCellUpdate("", cellID);
      }
    }

    setNumCols((prevNumCols) => prevNumCols - 1);
  };

  /**
   * Renders the headers of the columns with the A ... AA by using mod 26.
   *
   * @author rishavsarma5, eduardo-ruiz-garay
   * @returns the new headers for the columns
   */
  const renderSheetHeader = () => {
    const headers = [];
    headers.push(<th key="header-empty" className="header"></th>);

    const col = numCols;
    for (let i = 0; i < col; i++) {
      const letters: string = getHeaderLetter(i);
      headers.push(
        <th key={`header-${letters}`} className="header">
          {letters}
        </th>
      );
    }

    headers.push(
      <th key="delete-column-header" className="button-header">
        <button
          onClick={deleteCol}
          className="delete-column-button"
          key="delete-column-button"
        >
          - Column
        </button>
      </th>
    );

    headers.push(
      <th key="add-column-header" className="button-header">
        <button
          onClick={addNewCol}
          className="add-column-button"
          key="add-column-button"
        >
          + Column
        </button>
      </th>
    );

    return <tr>{headers}</tr>;
  };

  /**
   * Renders the rows and renders cells for each column in each row.
   *
   * @author rishavsarma5, eduardo-ruiz-garay
   * @returns the row headers and cells per row
   */
  const renderSheetRows = () => {
    const rows = [];

    for (let row = 1; row <= numRows; row++) {
      const cellsPerRow = [];
      cellsPerRow.push(
        <td key={`row-header-${row}`} className="row-header">
          {row}
        </td>
      );

      for (let col = 0; col < numCols; col++) {
        const columnLetter: string = getHeaderLetter(col);
        const cellId = `$${columnLetter}${row}`;
        const cellValue = Object.prototype.hasOwnProperty.call(incomingUpdates, cellId) ? incomingUpdates[cellId] : sheetData[cellId];
        const isUpdated = Object.prototype.hasOwnProperty.call(incomingUpdates, cellId);

        cellsPerRow.push(
          <Cell
            key={cellId}
            cellId={cellId}
            onUpdate={handleCellUpdate}
            sheetData={sheetData}
            cellValue={cellValue}
            isUpdated={isUpdated}
          />
        );
      }
      rows.push(
        <tr key={`row-${row}`} className="row">
          {cellsPerRow}
        </tr>
      );
    }

    rows.push(
      <tr key="row-buttons">
        <td className="button-header">
          <button
            onClick={deleteRow}
            className="delete-row-button"
            key="delete-row-button"
          >
            - Row
          </button>
          <button
            onClick={addNewRow}
            className="add-row-button"
            key="add-row-button"
          >
            + Row
          </button>
        </td>
        <td colSpan={numCols}></td>
      </tr>
    );

    return <>{rows}</>;
  };

  /**
   * @description Collects the updates made to this sheet and pushes them to server based on sheet relationship.
   *
   * @author kris-amerman, rishavsarma5, eduardo-ruiz-garay
   */
  const onPublishButtonClick = async () => {
    // iterates through sheetData and stores updates in a new-line delimited string
    const getAllCellUpdates = (): string => {
      const payload: string[] = [];
    
      for (const [ref, valueAtCell] of Object.entries(sheetData)) {
        const prevValueAtCell = prevCellDataRef.current[ref] || "";
        // Include cells with updated values or empty values if marked as manually updated
        console.log(`manual update for ${ref}`);
        console.log(JSON.stringify(manualUpdates, null, 2));
        if ((valueAtCell !== prevValueAtCell || valueAtCell === "") && manualUpdates.has(ref)) {
          payload.push(`${ref} ${valueAtCell}`);
        }
      }
  
      return payload.join("\n");
    };
  
    const payload = getAllCellUpdates();
  
    // Argument object with updates to the sheet
    const allUpdates: Argument = {
      id: "",
      publisher: sheetInfo.publisher,
      sheet: sheetInfo.sheet,
      payload: payload,
    };
  
    console.log(`Role is: ${sheetRelationship}, User is: ${sessionStorage.getItem("username")}`)
  
    console.log("PAYLOAD:")
    console.log(allUpdates.payload);
  
    if (sheetRelationship === "OWNER") {
      console.log(`calling updatePublished`)
      try {
        await fetchWithAuth("updatePublished", {
          method: "POST",
          body: JSON.stringify(allUpdates),
        });
  
        // Reset manualUpdates sets to empty after successful fetch
        setManualUpdates(new Set());
        setPopupMessage("Publish successful!"); // Show success popup
      } catch (error) {
        console.error("Error publishing new changes", error);
        setPopupMessage("Error publishing new changes"); // Show fail popup
      }
    } else {
      console.log(`calling updateSubscription`)
      try {
        await fetchWithAuth("updateSubscription", {
          method: "POST",
          body: JSON.stringify(allUpdates),
        });
  
        // Reset manualUpdates sets to empty after successful fetch
        setManualUpdates(new Set());
        setPopupMessage("Publish successful!"); // Show success popup
      } catch (error) {
        console.error("Error publishing new changes", error);
        setPopupMessage("Error publishing new changes"); // Show fail popup
      }
    }
  };

  /**
   * @description Requests updates to the sheet based on client's relationship to the sheet.
   *
   * @author kris-amerman
   */
  const requestUpdatesHandler = async () => {
    const argument: Argument = {
      publisher: sheetInfo.publisher,
      sheet: sheetInfo.sheet,
      id: latestUpdateID,
      payload: ""
    };

    if (sheetRelationship === "OWNER") {
      console.log("ARGUMENT")
      console.log(argument)
      await fetchWithAuth(
        "getUpdatesForSubscription",
        {
          method: "POST",
          body: JSON.stringify(argument)
        },
        async (data) => {
          console.log("INCOMING DATA:");
          console.log(data);

          if (data.success && data.value && data.value.length > 0) {
            const update = data.value[0];
            const sheetUpdateHandler = SheetUpdateHandler.getInstance();
            sheetUpdateHandler.setSheetSize(numRows, numCols);
            const updates = await sheetUpdateHandler.applyUpdates(update);
            console.log("UPDATES")
            console.log(updates);

            const { updatedSheetRow, updatedSheetCol} = sheetUpdateHandler.getUpdatedSheetSize();

            if (updatedSheetRow > numRows) {
              for (let i = 0; i < updatedSheetRow - numRows; i++) {
                addNewRow();
              }
            }

            if (updatedSheetCol > numCols) {
              for (let i = 0; i < updatedSheetCol - numCols; i++) {
                addNewCol();
              }
            }


            // Check if payload is not empty before updating the sheetData
            if (update.payload !== "") {
              setSheetData(prevSheetData => ({
                ...prevSheetData,
                ...updates
              }));

            }
            argument.id = update.id;
          }
        }
      );
      console.log("ARGUMENT")
      console.log(argument)
      await fetchWithAuth(
        "getUpdatesForPublished",
        {
          method: "POST",
          body: JSON.stringify(argument)
        },
        async (data) => {
          console.log("INCOMING DATA:");
          console.log(data);

          if (data.success && data.value && data.value.length > 0) {
            const update = data.value[0];
            const sheetUpdateHandler = SheetUpdateHandler.getInstance();
            sheetUpdateHandler.setSheetSize(numRows, numCols);
            const updates = await sheetUpdateHandler.applyUpdates(update);
            console.log("UPDATES")
            console.log(updates);

            const { updatedSheetRow, updatedSheetCol} = sheetUpdateHandler.getUpdatedSheetSize();

            if (updatedSheetRow > numRows) {
              for (let i = 0; i < updatedSheetRow - numRows; i++) {
                addNewRow();
              }
            }

            if (updatedSheetCol > numCols) {
              for (let i = 0; i < updatedSheetCol - numCols; i++) {
                addNewCol();
              }
            }

            // Check if payload is not empty before updating the sheetData
            if (update.payload !== "") {

              // Add updated cell IDs to the incomingUpdates state
              setIncomingUpdates(updates);
            }

            console.log(`SET NEW UPDATE ID TO ${update.id}`)
            setLatestUpdateID(update.id);
          }
        }
      );
    } else {
      console.log("ARGUMENT")
      console.log(argument)
      await fetchWithAuth(
        "getUpdatesForSubscription",
        {
          method: "POST",
          body: JSON.stringify(argument)
        },
        async (data) => {
          console.log("INCOMING DATA:");
          console.log(data);

          if (data.success && data.value && data.value.length > 0) {
            const update = data.value[0];
            const sheetUpdateHandler = SheetUpdateHandler.getInstance();
            sheetUpdateHandler.setSheetSize(numRows, numCols);
            const updates = await sheetUpdateHandler.applyUpdates(update);
            console.log("UPDATES")
            console.log(updates);

            const { updatedSheetRow, updatedSheetCol } = sheetUpdateHandler.getUpdatedSheetSize();

            if (updatedSheetRow > numRows) {
              for (let i = 0; i < updatedSheetRow - numRows; i++) {
                addNewRow();
              }
            }

            if (updatedSheetCol > numCols) {
              for (let i = 0; i < updatedSheetCol - numCols; i++) {
                addNewCol();
              }
            }

            // Check if payload is not empty before updating the sheetData
            if (update.payload !== "") {
              setSheetData(prevSheetData => ({
                ...prevSheetData,
                ...updates
              }));
            }

            console.log(`SET NEW UPDATE ID TO ${update.id}`)
            setLatestUpdateID(update.id);
          }
        }
      );
    }
  };

  /**
   * @description Commits the `incomingUpdates` (i.e., those from `getUpdatesForPublished`) to `sheetData`. 
   *
   * @author kris-amerman
   */
  const acceptIncomingUpdates = () => {
    setSheetData((prevSheetData) => {
      // Merge incoming updates into the sheetData
      const updatedSheetData = {
        ...prevSheetData,
        ...incomingUpdates,
      };

      return updatedSheetData;
    });

    // Include incoming updates in the manual updates
    setManualUpdates((prevManualUpdates) => {

      const updatedManualUpdates = new Set(prevManualUpdates);

      Object.keys(incomingUpdates).forEach((ref) => {

        updatedManualUpdates.add(ref);

      });

      return updatedManualUpdates;

    });

    // Clear incomingUpdates after accepting
    setIncomingUpdates({});
  };

  /**
   * @description Effectively ignores and erases `incomingUpdates`. 
   *
   * @author kris-amerman
   */
  const denyIncomingUpdates = () => {
    setIncomingUpdates({});
  };

  /**
   * @description Dynamically renders "Accept" and "Deny" buttons for incoming changes. 
   *
   * @author kris-amerman
   */
  const renderUpdateButtons = () => {
    if (Object.keys(incomingUpdates).length > 0) {
      return (
        <div className="update-buttons">
          <button onClick={acceptIncomingUpdates}>Accept</button>
          <button onClick={denyIncomingUpdates}>Deny</button>
        </div>
      );
    } else {
      return null; // hide buttons if there are no incoming updates
    }
  };

  /**
   * @description Render the Sheet. 
   *
   * @author rishavsarma5, kris-amerman
   */
  return (
    <div className="sheet-container">
      <div className="info-section">
        <button onClick={() => { requestUpdatesHandler() }}>Request Updates</button>
        <div className="publisher-info">Publisher: {sheetInfo.publisher}</div>
        <div className="sheet-name">Sheet Name: {sheetInfo.sheet}</div>
        <button
          onClick={onPublishButtonClick}
          className="publish-button"
          key="publish-button"
        >
          Publish
        </button>
      </div>
      <div className="sheet-wrapper">
        {renderUpdateButtons()}
        <table className="sheet">
          <thead>{renderSheetHeader()}</thead>
          <tbody>{renderSheetRows()}</tbody>
        </table>
      </div>
      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
    </div>
  );
};

export default Sheet;

import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Popup from "../components/Popup";
import Cell from "./Cell";

import fetchWithAuth from "../utils/fetchWithAuth";
import initializeSheet from "../utils/initializeSheet";
import addRowData from "../utils/addRowData";
import addColData from "../utils/addColData";
import deleteColData from "../utils/deleteColData";
import deleteRowData from "../utils/deleteRowData";
import getHeaderLetter from "../utils/getHeaderLetter";
import generateSheetDataMap from "../utils/generateSheetDataMap";

import { Argument } from "../../../types/types";
import { SheetDataMap, SheetRelationship, GetUpdatesEndpoint, SendUpdatesEndpoint } from "../types";

import "../styles/Sheet.css";

// Constants
const INITIALSHEETROWSIZE = 10;
const INITIALSHEETCOLUMNSIZE = 10;

/**
 * A Sheet that manages the data of its child Cells.
 *
 * @author kris-amerman
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
  const [refsToPublish, setRefsToPublish] = useState<Set<string>>(new Set());
  const [incomingUpdates, setIncomingUpdates] = useState<SheetDataMap>({});
  const [sheetRelationship, setSheetRelationship] = useState<SheetRelationship>("SUBSCRIBER");
  const [latestPublishedUpdateID, setLatestPublishedUpdateID] = useState<string>("0");
  const [latestSubscriptionUpdateID, setLatestSubscriptionUpdateID] = useState<string>("0");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const [numRows, setNumRows] = useState(INITIALSHEETROWSIZE);
  const [numCols, setNumCols] = useState(INITIALSHEETCOLUMNSIZE);

  /**
   * Actions to perform on first load.
   * 
   * @author kris-amerman
   */
  useEffect(() => {
    // If the publisher for the current sheet is the same as the current user,
    // set the sheetRelationship to OWNER
    if (sheetInfo.publisher === sessionStorage.getItem("username")) {
      setSheetRelationship("OWNER")
    }
  }, []);

  // TODO delete
  useEffect(() => {
    // console.log('----------------------------------')
    // console.log(`subscription ID: ${latestSubscriptionUpdateID}`)
    // console.log(`published ID: ${latestPublishedUpdateID}`)
    // console.log('sheetData')
    // console.log(sheetData)
    // console.log('refsToPublish')
    // console.log(refsToPublish)
    // console.log('incomingUpdates')
    // console.log(incomingUpdates)
    // console.log('----------------------------------')
  }, [latestSubscriptionUpdateID, latestPublishedUpdateID, sheetData, refsToPublish, incomingUpdates])

  /**
   * Updates the sheetData when a cell's input changes.
   *
   * @author kris-amerman
   */
  const handleCellUpdate = (value: string, cellId: string) => {
    setSheetData((prevSheetData) => {
      const updatedSheetData = { ...prevSheetData, [cellId]: value };

      // If the value is different from the previous one, or if the value is empty, mark it as manually updated
      if (value !== prevSheetData[cellId]) {
        setRefsToPublish((prevManualUpdates) => new Set(prevManualUpdates).add(cellId));
      }

      return updatedSheetData;
    });
  };

  /**
   * Add a new empty row.
   *
   * @author rishavsarma5
   */
  const addNewRow = () => {
    setNumRows((prevNumRows) => prevNumRows + 1);
    const newSheetData = addRowData(sheetData, numRows, numCols);
    setSheetData(newSheetData);
  };

  /**
   * Delete a row.
   *
   * @author rishavsarma5
   */
  const deleteRow = () => {
    const updatedSheetData = deleteRowData(sheetData, numRows, numCols, handleCellUpdate);
    setNumRows((prevNumRows) => (prevNumRows > 1 ? prevNumRows - 1 : prevNumRows));
    setSheetData(updatedSheetData);
  };

  /**
   * Add a new empty column.
   *
   * @author rishavsarma5
   */
  const addNewCol = () => {
    setNumCols((prevNumCols) => prevNumCols + 1);
    const newSheetData = addColData(sheetData, numCols, numRows);
    setSheetData(newSheetData);
  };

  /**
   * Delete a column.
   *
   * @author rishavsarma5
   */
  const deleteCol = () => {
    const updatedSheetData = deleteColData(sheetData, numCols, numRows, handleCellUpdate);
    setNumCols((prevNumCols) => (prevNumCols > 1 ? prevNumCols - 1 : prevNumCols));
    setSheetData(updatedSheetData);
  };


  /**
   * Iterate through the given SheetDataMap and build a payload based on the given refs to include. 
   * 
   * @author kris-amerman
   */
  const buildPayload = (refs: Set<string>, updatedSheetData: SheetDataMap): string => {
    const payload: string[] = [];
    for (const [ref, valueAtCell] of Object.entries(updatedSheetData)) {
      if (refs.has(ref)) {
        payload.push(`${ref} ${valueAtCell}`);
      }
    }
    return payload.length ? payload.join("\n") + "\n" : "";
  };

  /**
   * Publish the values for the given refs in the given SheetDataMap.
   *
   * @author kris-amerman
   */
  const publishRefs = async (refs: Set<string>, updatedSheetData: SheetDataMap, endpoint: SendUpdatesEndpoint) => {
    const payload = buildPayload(refs, updatedSheetData);

    const allUpdates = {
      id: "",
      publisher: sheetInfo.publisher,
      sheet: sheetInfo.sheet,
      payload: payload,
    };

    try {
      await fetchWithAuth(endpoint, {
        method: "POST",
        body: JSON.stringify(allUpdates),
      });
      setRefsToPublish(new Set());
      setPopupMessage("Publish successful!");
    } catch (error) {
      console.error("Error publishing new changes", error);
      setPopupMessage("Error publishing new changes");
    }
  };


  // TODO change the language on this
  const currRowSizeRef = useRef<number>(0);
  const currColSizeRef = useRef<number>(0);

  const setSheetSize = (row: number, col: number): void => {
    currRowSizeRef.current = row;
    currColSizeRef.current = col;
  };

  const getUpdatedSheetSize = (): { updatedSheetRow: number; updatedSheetCol: number } => {
    return { updatedSheetRow: currRowSizeRef.current, updatedSheetCol: currColSizeRef.current };
  };




  function getUnreconciledUpdates(existingUpdates: SheetDataMap, incomingUpdates: SheetDataMap): SheetDataMap {
    const unreconciledUpdates: SheetDataMap = {};

    for (const cell in incomingUpdates) {
      if (!(cell in existingUpdates) || existingUpdates[cell] !== incomingUpdates[cell]) {
        unreconciledUpdates[cell] = incomingUpdates[cell];
      }
    }

    return unreconciledUpdates;
  }

  type PendingUpdates = {
    id: string,
    updates: SheetDataMap,
  }

  const emptySubscriptionUpdates: PendingUpdates = {
    id: '',
    updates: {} as SheetDataMap,
  };

  const emptyPublishedUpdates: PendingUpdates = {
    id: '',
    updates: {} as SheetDataMap,
  };

  const unhandledSubscriptionUpdates = useRef<PendingUpdates>(emptySubscriptionUpdates);
  const unhandledPublishedUpdates = useRef<PendingUpdates>(emptyPublishedUpdates);


  /**
   * Stores updates in either sheetData or incomingUpdates based on the provided endpoint.
   * 
   * Subscription updates will be automatically applied to the sheetData.
   * Published updates will be held in incomingUpdates until dealt with.
   * 
   * @param {string} id - The identifier associated with the updates.
   * @param {UpdatesEndpoint} updatesEndpoint - The endpoint specifying the type of updates.
   * @param {SheetDataMap} updates - The updates to apply to the sheet data or incoming updates.
   * @returns {void}
   * 
   * @author kris-amerman
   */
  const handleUpdates = (id: string, updatesEndpoint: GetUpdatesEndpoint, updates: SheetDataMap) => {
    if (updatesEndpoint === "getUpdatesForSubscription") {
      unhandledSubscriptionUpdates.current.updates = updates;
      unhandledSubscriptionUpdates.current.id = id;
      // setSheetData(prevSheetData => ({ ...prevSheetData, ...updates }));
      // setLatestSubscriptionUpdateID(id)
    } else if (updatesEndpoint === "getUpdatesForPublished") {
      unhandledPublishedUpdates.current.updates = updates;
      unhandledPublishedUpdates.current.id = id;
      // setIncomingUpdates(updates);
      // setLatestPublishedUpdateID(id)
    }
  };

  /**
   * Handles the result of getUpdates. Modifies the size of the sheet and returns the parsed updates.
   * 
   * @param {Result} result - The result object containing the updates argument.
   * @returns {SheetDataMap} - The parsed updates as a SheetDataMap.
   * 
   * @author kris-amerman
   */
  const handleGetUpdatesResult = (resultArgument: Argument) => {
    // Set the sheet size using state hooks
    setSheetSize(numRows, numCols);

    // Generate sheet updates using local function instead of SheetUpdateHandler
    // TODO: I think we need to return the currCol/row stuff or pull it out of this function to do its own thing (for sheet expansion??)
    const updates = generateSheetDataMap(resultArgument.payload, currColSizeRef.current, currRowSizeRef.current);

    // Get updated sheet sizes from state hooks
    const { updatedSheetRow, updatedSheetCol } = getUpdatedSheetSize();

    // Dynamically add rows if needed
    if (updatedSheetRow > numRows) {
      for (let i = 0; i < updatedSheetRow - numRows; i++) {
        addNewRow();
      }
    }

    // Dynamically add columns if needed
    if (updatedSheetCol > numCols) {
      for (let i = 0; i < updatedSheetCol - numCols; i++) {
        addNewCol();
      }
    }

    return updates;
  };

  /**
   * Retrieves subscription or published updates. Gets all updates that occurred after the given id.
   * If successful, calls handleGetUpdatesResult to process the returned data and update state.
   * 
   * @param {UpdatesEndpoint} updatesEndpoint - The endpoint to send the request to.
   * @param {string} id - The update id. 
   * @returns {Promise<void>}
   * 
   * @author kris-amerman
   */
  const getUpdates = async (updatesEndpoint: GetUpdatesEndpoint, id: string) => {
    const argument: Argument = {
      publisher: sheetInfo.publisher,
      sheet: sheetInfo.sheet,
      id: id,
      payload: ""
    };

    await fetchWithAuth(updatesEndpoint,
      {
        method: "POST",
        body: JSON.stringify(argument)
      },
      (data) => {
        if (data.success && data.value && data.value.length > 0) {
          const resultArgument = data.value[0];
          console.log('RESULT')
          console.log(resultArgument)
          const updates = handleGetUpdatesResult(resultArgument);
          handleUpdates(resultArgument.id, updatesEndpoint, updates);
        }
      }
    );
  };

  const resolvePendingUpdates = () => {
    console.log(unhandledSubscriptionUpdates.current.updates)
    const subscriptionUpdates = unhandledSubscriptionUpdates.current.updates;
    setSheetData(prevSheetData => ({ ...prevSheetData, ...subscriptionUpdates }));
    setLatestSubscriptionUpdateID(unhandledSubscriptionUpdates.current.id);

    const unreconciledUpdates = getUnreconciledUpdates(unhandledSubscriptionUpdates.current.updates, unhandledPublishedUpdates.current.updates);
    setIncomingUpdates(unreconciledUpdates)
    setLatestPublishedUpdateID(unhandledPublishedUpdates.current.id);

    unhandledSubscriptionUpdates.current = emptySubscriptionUpdates;
    unhandledPublishedUpdates.current = emptyPublishedUpdates;
  }

  /**
   * Request updates based on the client's relationship to the sheet.
   *
   * @author kris-amerman
   */
  const handleRequestUpdates = async () => {
    if (sheetRelationship === "OWNER") {
      await getUpdates("getUpdatesForSubscription", latestSubscriptionUpdateID);
      await getUpdates("getUpdatesForPublished", latestPublishedUpdateID);
      resolvePendingUpdates();
    } else if (sheetRelationship === "SUBSCRIBER") {
      await getUpdates("getUpdatesForSubscription", latestSubscriptionUpdateID);
      resolvePendingUpdates();
    }
  };

  /**
   * Accept the incoming updates.
   *
   * @author kris-amerman
   */
  const handleAccept = async () => {
    // Update sheetData with incomingUpdates
    setSheetData(prevSheetData => {
      const newSheetData = { ...prevSheetData, ...incomingUpdates };

      // Include incoming updates in the refs to publish
      const updatedRefs = new Set<string>();
      Object.keys(incomingUpdates).forEach((ref) => {
        updatedRefs.add(ref);
      });

      // Call publishRefs with the updated state
      publishRefs(updatedRefs, newSheetData, "updatePublished");

      return newSheetData;
    });

    // Clear incomingUpdates after accepting
    setIncomingUpdates({});
  };

  /**
   * Deny the incoming updates.
   * 
   * Overwrite the incoming updates by re-asserting the existing cell values.
   *
   * @author kris-amerman
   */
  const handleDeny = async () => {
    // Include incoming updates in the refs to publish
    const updatedRefs = new Set<string>();
    Object.keys(incomingUpdates).forEach((ref) => {
      updatedRefs.add(ref);
    });

    publishRefs(updatedRefs, sheetData, "updatePublished");

    // "Correct" the subscriber(s)
    publishRefs(updatedRefs, sheetData, "updateSubscription");

    // Clear incomingUpdates
    setIncomingUpdates({});
  };

  /**
   * Renders the headers of the columns with the A ... AA by using mod 26.
   *
   * @author rishavsarma5
   * @returns the headers to render for the columns.
   */
  const renderSheetHeader = () => {
    const headers: JSX.Element[] = [];
    headers.push(<th key="header-empty" className="header"></th>);

    for (let i = 0; i < numCols; i++) {
      const letters = getHeaderLetter(i);
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
   * Renders Cells for each column in each row.
   *
   * @author rishavsarma5
   * @returns the rows to render.
   */
  const renderSheetRows = () => {
    const rows: JSX.Element[] = [];

    for (let row = 1; row <= numRows; row++) {
      const cellsPerRow: JSX.Element[] = [];
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
   * Render the Sheet. 
   *
   * @author rishavsarma5
   */
  return (
    <div className="sheet-container">
      <div className="info-section">
        <button onClick={handleRequestUpdates}>Request Updates</button>
        <div className="publisher-info">Publisher: {sheetInfo.publisher}</div>
        <div className="sheet-name">Sheet Name: {sheetInfo.sheet}</div>
        <button
          onClick={() => {
            publishRefs(
              refsToPublish, 
              sheetData,
              sheetRelationship === "OWNER" ? "updatePublished" : "updateSubscription"
            )
          }}
          className="publish-button"
          key="publish-button"
        >
          Publish
        </button>
      </div>
      <div className="sheet-wrapper">
        {Object.keys(incomingUpdates).length > 0
          ?
          <div className="update-buttons">
            <button onClick={handleAccept}>Accept</button>
            <button onClick={handleDeny}>Deny</button>
          </div>
          :
          <></>
        }
        <table className="sheet">
          <thead>
            {renderSheetHeader()}
          </thead>
          <tbody>
            {renderSheetRows()}
          </tbody>
        </table>
      </div>
      {popupMessage && (
        <Popup message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
    </div>
  );
};

export default Sheet;
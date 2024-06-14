import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import buildPayload from "../utils/buildPayload";
import getUnreconciledUpdates from "../utils/getUnreconciledUpdates";

import { Argument } from "../../../types/types";
import {
  SheetDataMap,
  SheetRelationship,
  GetUpdatesEndpoint,
  SendUpdatesEndpoint,
  UpdatesWithId,
} from "../types";

import "../styles/Sheet.css";
import Parser from "../functions/Parser";
import Evaluator from "../functions/Evaluator";
import findDependencies from "../utils/findDependencies";
import toCSV from "../utils/toCSV";
import { validateSheet } from "../utils/validateSheet";

// Constants
const INITIALSHEETROWSIZE = 10;
const INITIALSHEETCOLUMNSIZE = 10;
const BASE_SUBSCRIPTION_UPDATES: UpdatesWithId = {
  id: "",
  updates: {} as SheetDataMap,
};
const BASE_PUBLISHED_UPDATES: UpdatesWithId = {
  id: "",
  updates: {} as SheetDataMap,
};
const parser = Parser.getInstance();
const evaluator = Evaluator.getInstance();

/**
 * A Sheet that manages the data of its child cells and handles communication.
 *
 * @author kris-amerman
 */
const Sheet: React.FC = () => {
  // Receive contextual information about sheet.
  const sheetInfo = useParams<{ publisher: string; sheet: string }>();
  const navigate = useNavigate();

  // Initialize the SheetDataMap
  const initialSheetData: SheetDataMap = initializeSheet(
    INITIALSHEETROWSIZE,
    INITIALSHEETCOLUMNSIZE
  );

  // Sheet state
  const [sheetData, setSheetData] = useState<SheetDataMap>(initialSheetData);
  const [refsToPublish, setRefsToPublish] = useState<Set<string>>(new Set());
  const [incomingUpdates, setIncomingUpdates] = useState<SheetDataMap>({});
  const [sheetRelationship, setSheetRelationship] = useState<SheetRelationship>("SUBSCRIBER");
  const [isRelationshipSet, setIsRelationshipSet] = useState<boolean>(false);
  const [latestPublishedUpdateID, setLatestPublishedUpdateID] = useState<string>("0");
  const [latestSubscriptionUpdateID, setLatestSubscriptionUpdateID] = useState<string>("0");
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const [numRows, setNumRows] = useState(INITIALSHEETROWSIZE);
  const [numCols, setNumCols] = useState(INITIALSHEETCOLUMNSIZE);

  const pendingSubUpdates = useRef<UpdatesWithId>(BASE_SUBSCRIPTION_UPDATES);
  const pendingPubUpdates = useRef<UpdatesWithId>(BASE_PUBLISHED_UPDATES);

  const [pendingEvaluationCells, setPendingEvaluationCells] = useState<string[]>([]);

  /**
   * Actions to perform on first load.
   *
   * @author kris-amerman
   */
  useEffect(() => {
    const onPageLoad = async () => {
      await validateSheet(sheetInfo, navigate);

      // If the publisher for the current sheet is the same as the current user,
      // set the sheetRelationship to OWNER
      if (sheetInfo.publisher === sessionStorage.getItem("username")) {
        setSheetRelationship("OWNER");
      }
      setIsRelationshipSet(true);
    };

    onPageLoad();
  }, []);

  useEffect(() => {
    if (isRelationshipSet) {
      requestUpdates();
    }
  }, [isRelationshipSet]);

  /**
   * Updates the sheetData with new cell value.
   *
   * @param {string} value - new cell value
   * @param {string} cellId - the cell to update
   *
   * @author kris-amerman
   */
  const handleCellUpdate = (value: string, cellId: string) => {
    setSheetData((prevSheetData) => {
      const updatedSheetData = { ...prevSheetData, [cellId]: value };

      // Track dependencies for this cellId
      const dependencies = findDependencies(updatedSheetData, cellId);
      dependencies.forEach((dep) => {
        if (!pendingEvaluationCells.includes(dep)) {
          setPendingEvaluationCells((prevPendingCells) => [
            ...prevPendingCells,
            dep,
          ]);
        }
      });

      // If the value is different from the previous one, or if the value is empty, mark it as manually updated
      if (value !== prevSheetData[cellId]) {
        setRefsToPublish((prevManualUpdates) =>
          new Set(prevManualUpdates).add(cellId)
        );
      }

      return updatedSheetData;
    });
  };

  /**
   * Evaluates updated cells before render.
   *
   * @param {SheetDataMap} sheetDataMap - current state of sheetData
   *
   * @author rishavsarma5
   */
  const evaluatePendingCells = async (sheetData: SheetDataMap) => {
    const updatedData: SheetDataMap = { ...sheetData };
    const pendingCellsSet = new Set(pendingEvaluationCells);

    // determines if the dependencies of a cell are in pendingCellsSet
    const areDependenciesResolved = (dependencies: string[]): boolean => {
      return dependencies.every((dep) => !pendingCellsSet.has(dep));
    };

    // waits until all cells are evaluated by checking their dependencies and waiting for
    // those to resolve first
    while (pendingCellsSet.size > 0) {
      const cellsToEvaluate: string[] = [];

      // Find cells that can be evaluated in this iteration
      for (const cellId of pendingCellsSet) {
        const dependencies = findDependencies(updatedData, cellId);
        if (areDependenciesResolved(dependencies)) {
          cellsToEvaluate.push(cellId);
        }
      }

      // checks for cyclic references in cells
      if (cellsToEvaluate.length === 0) {
        console.error(
          "Cyclic dependency detected or unsatisfiable dependencies"
        );
        break;
      }

      // Evaluate cells in parallel
      const promises = cellsToEvaluate.map(async (cellId) => {
        const cellValue = updatedData[cellId];
        try {
          const parsedNode = parser.parse(cellValue);
          evaluator.setContext(updatedData);
          const result = evaluator.evaluate(parsedNode);
          updatedData[cellId] = result;

          // Remove evaluated cell from pending set only if successful
          pendingCellsSet.delete(cellId);
        } catch (error) {
          console.error(`Error evaluating formula in ${cellId}:`, error);
        }
      });

      // Wait for all evaluations in this iteration to complete
      await Promise.all(promises);

      // If no cells were successfully evaluated and removed from the pending set, break to avoid infinite loop
      if (cellsToEvaluate.every((cellId) => pendingCellsSet.has(cellId))) {
        console.error(
          "Cyclic dependency detected or unsatisfiable dependencies"
        );
        break;
      }
    }

    // Clear pending cells
    setPendingEvaluationCells([]);
    // Update sheetData with evaluated values
    setSheetData(updatedData);
  };

  /**
   * Determines if incoming updates need to be evaluated beforehand if they are formulas.
   *
   * @param {SheetDataMap} sheetDataMap - current state of sheetData
   *
   * @author rishavsarma5
   */
  const evaluateIncomingUpdates = async (updates: SheetDataMap) => {
    // Identify cells from incoming updates that need evaluation (checking if they are a formula)
    const cellsToUpdate = Object.keys(updates).filter((cellId) => {
      return updates[cellId].startsWith("=");
    });

    // Add cells to pendingCells for evaluation
    setPendingEvaluationCells((prevPendingCells) => [
      ...prevPendingCells,
      ...cellsToUpdate.filter((cellId) => !prevPendingCells.includes(cellId)),
    ]);
  };

  /**
   * If there are pending cells to evaluate before render, this will trigger the function to 
   * evaluate them.
   *
   * @author rishavsarma5
   */
  useEffect(() => {
    if (pendingEvaluationCells.length > 0) {
      evaluatePendingCells(sheetData);
    }
  }, [pendingEvaluationCells]);

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
    deleteRowData(sheetData, numRows, numCols, handleCellUpdate);
    setNumRows((prevNumRows) =>
      prevNumRows > 1 ? prevNumRows - 1 : prevNumRows
    );
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
    deleteColData(sheetData, numCols, numRows, handleCellUpdate);
    setNumCols((prevNumCols) =>
      prevNumCols > 1 ? prevNumCols - 1 : prevNumCols
    );
  };

  /**
   * Publish the values in the given SheetDataMap for the given refs.
   *
   * @param {Set<string>} refs - the refs to publish
   * @param {SheetDataMap} updatedSheetData - the sheet data to use for reference
   * @param {SendUpdatesEndpoint} refs - the endpoint to publish to
   *
   * @author kris-amerman
   */
  const publishRefs = async (
    refs: Set<string>,
    updatedSheetData: SheetDataMap,
    endpoint: SendUpdatesEndpoint
  ) => {
    const payload = buildPayload(refs, updatedSheetData);

    const allUpdates = {
      id: "",
      publisher: sheetInfo.publisher,
      sheet: sheetInfo.sheet,
      payload: payload,
    };

    try {
      await fetchWithAuth(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify(allUpdates),
        },
        () => {
          setRefsToPublish(new Set());
          setPopupMessage("Publish successful!");
        },
        () => {
          setPopupMessage("Error publishing new changes");
        }
      );
    } catch (error) {
      console.error("Error publishing new changes", error);
      setPopupMessage("Error publishing new changes");
    }
  };

  /**
   * Request updates based on the client's relationship to the sheet.
   *
   * @author kris-amerman
   */
  const requestUpdates = async () => {
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
   * Retrieves subscription or published updates. Gets all updates that occurred after the given id.
   * If successful, calls handleGetUpdatesResult to process the returned data and update state.
   *
   * @param {UpdatesEndpoint} updatesEndpoint - the endpoint to send the request to
   * @param {string} id - the update id
   *
   * @author kris-amerman
   */
  const getUpdates = async (
    updatesEndpoint: GetUpdatesEndpoint,
    id: string
  ) => {
    const argument: Argument = {
      publisher: sheetInfo.publisher!,
      sheet: sheetInfo.sheet!,
      id: id,
      payload: "",
    };

    await fetchWithAuth(
      updatesEndpoint,
      {
        method: "POST",
        body: JSON.stringify(argument),
      },
      async (data) => {
        if (data.success && data.value && data.value.length > 0) {
          const resultArgument = data.value[0];
          const updates = handleGetUpdatesResult(resultArgument);
          await evaluateIncomingUpdates(updates);
          setPendingUpdates(resultArgument.id, updatesEndpoint, updates);
        }
      }
    );
  };

  /**
   * Handles the result of getUpdates. Modifies the size of the sheet and returns the parsed updates.
   *
   * @param {Result} result - the result object containing the updates argument
   * @returns {SheetDataMap} - the parsed updates as a SheetDataMap
   *
   * @author kris-amerman
   */
  const handleGetUpdatesResult = (resultArgument: Argument): SheetDataMap => {
    // Convert payload to SheetDataMap and adjust sheet bounds
    const { sheetMap, newColSize, newRowSize } = generateSheetDataMap(
      resultArgument.payload,
      numCols,
      numRows
    );

    // Dynamically add rows if needed
    if (newRowSize > numRows) {
      for (let i = 0; i < newRowSize - numRows; i++) {
        addNewRow();
      }
    }

    // Dynamically add columns if needed
    if (newColSize > numCols) {
      for (let i = 0; i < newColSize - numCols; i++) {
        addNewCol();
      }
    }

    return sheetMap;
  };

  /**
   * Sets pending updates based on the provided endpoint.
   *
   * Subscription updates will be automatically applied to the sheetData.
   * Published updates will be held in incomingUpdates until dealt with.
   *
   * @param {string} id - the identifier associated with the updates
   * @param {UpdatesEndpoint} updatesEndpoint - the endpoint specifying the type of updates
   * @param {SheetDataMap} updates - the updates to apply to the sheet data or incoming updates
   *
   * @author kris-amerman
   */
  const setPendingUpdates = (
    id: string,
    updatesEndpoint: GetUpdatesEndpoint,
    updates: SheetDataMap
  ) => {
    if (updatesEndpoint === "getUpdatesForSubscription") {
      pendingSubUpdates.current.updates = updates;
      pendingSubUpdates.current.id = id;
    } else if (updatesEndpoint === "getUpdatesForPublished") {
      pendingPubUpdates.current.updates = updates;
      pendingPubUpdates.current.id = id;
    }
  };

  /**
   * Add pending subscription updates to sheetData.
   * Identify updates pending owner review and add to incomingUpdates.
   *
   * @author kris-amerman
   */
  const resolvePendingUpdates = () => {
    const subscriptionUpdates = pendingSubUpdates.current.updates;
    const publishedUpdates = pendingPubUpdates.current.updates;
    evaluateIncomingUpdates(subscriptionUpdates);
    setSheetData((prevSheetData) => ({
      ...prevSheetData,
      ...subscriptionUpdates,
    }));
    setLatestSubscriptionUpdateID(pendingSubUpdates.current.id);

    if (publishedUpdates && sheetRelationship === "OWNER") {
      const unreconciledUpdates = getUnreconciledUpdates(
        subscriptionUpdates,
        publishedUpdates
      );
      evaluateIncomingUpdates(unreconciledUpdates);
      setIncomingUpdates(unreconciledUpdates);
      setLatestPublishedUpdateID(pendingPubUpdates.current.id);
    }

    pendingSubUpdates.current = BASE_SUBSCRIPTION_UPDATES;
    pendingPubUpdates.current = BASE_PUBLISHED_UPDATES;
  };

  /**
   * Accept the incoming updates.
   *
   * @author kris-amerman
   */
  const handleAccept = async () => {
    // Update sheetData with incomingUpdates
    setSheetData((prevSheetData) => {
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

    await publishRefs(updatedRefs, sheetData, "updatePublished");

    // "Correct" the subscriber(s)
    await publishRefs(updatedRefs, sheetData, "updateSubscription");

    // Clear incomingUpdates
    setIncomingUpdates({});
  };

  /**
   * Take the sheetData and export to CSV.
   *
   * @author kris-amerman
   */
  const handleExportToCSV = async () => {
    const csv = toCSV(sheetData);
    const element = document.createElement("a");
    const file = new Blob([csv], { type: "text/csv" });
    element.href = URL.createObjectURL(file);
    element.download = "data.csv";
    document.body.appendChild(element);
    element.click();
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

    sheetRelationship === "OWNER" &&
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

    sheetRelationship === "OWNER" &&
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
        const cellValue = Object.prototype.hasOwnProperty.call(
          incomingUpdates,
          cellId
        )
          ? incomingUpdates[cellId]
          : sheetData[cellId];
        const isUpdated = Object.prototype.hasOwnProperty.call(
          incomingUpdates,
          cellId
        );

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

    sheetRelationship === "OWNER" &&
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
        <div className="publish-request-buttons">
          <button className="info-section-button" onClick={requestUpdates}>
            Request Updates
          </button>
          <button
            onClick={() => {
              publishRefs(
                refsToPublish,
                sheetData,
                sheetRelationship === "OWNER"
                  ? "updatePublished"
                  : "updateSubscription"
              );
            }}
            className="info-section-button"
          >
            Publish
          </button>
        </div>
        <div className="sheet-name">Sheet Name: {sheetInfo.sheet}</div>
        <button className="info-section-button" onClick={handleExportToCSV}>
          Export To CSV
        </button>
      </div>
      <div className="sheet-wrapper">
        {Object.keys(incomingUpdates).length > 0 ? (
          <div className="accept-deny-container">
            <div className="update-buttons">
              <button className="accept-button" onClick={handleAccept}>
                Accept
              </button>
              <button className="deny-button" onClick={handleDeny}>
                Deny
              </button>
            </div>
            <p className="update-warning">
              Warning! This will change the sheet for everyone.
            </p>
          </div>
        ) : (
          <></>
        )}
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

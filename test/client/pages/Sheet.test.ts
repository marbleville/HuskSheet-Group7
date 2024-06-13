import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Sheet from '../../../client/src/pages/Sheet';

// Mock the dependencies used in the component
jest.mock('../../../client/src/utils/fetchWithAuth');
jest.mock('../../../client/src/utils/initializeSheet', () => jest.fn(() => ({})));
jest.mock('../../../client/src/utils/addRowData', () => jest.fn((data, numRows, numCols) => data));
jest.mock('../../../client/src/utils/addColData', () => jest.fn((data, numCols, numRows) => data));
jest.mock('../../../client/src/utils/deleteRowData', () => jest.fn((data, numRows, numCols) => data));
jest.mock('../../../client/src/utils/deleteColData', () => jest.fn((data, numCols, numRows) => data));
jest.mock('../../../client/src/utils/generateSheetDataMap', () => jest.fn(() => ({ sheetMap: {}, newColSize: 0, newRowSize: 0 })));
jest.mock('../../../client/src/utils/buildPayload', () => jest.fn(() => ({})));
jest.mock('../../../client/src/utils/getUnreconciledUpdates', () => jest.fn(() => ({})));

describe('Sheet Component', () => {
  const sheetInfoMock = { sheet: 'Test Sheet', publisher: 'testUser' };
  const locationMock = { state: sheetInfoMock };

  beforeEach(() => {
    jest.spyOn(window, 'sessionStorage', 'get').mockReturnValue({ getItem: () => 'testUser' });
  });

  const renderSheet = () => {
    render(
      <Router location={locationMock}>
        <Sheet />
      </Router>
    );
  };

  test('renders sheet component with initial elements', () => {
    renderSheet();
    expect(screen.getByText('Sheet Name: Test Sheet')).toBeInTheDocument();
    expect(screen.getByText('+ Column')).toBeInTheDocument();
    expect(screen.getByText('- Column')).toBeInTheDocument();
    expect(screen.getByText('+ Row')).toBeInTheDocument();
    expect(screen.getByText('- Row')).toBeInTheDocument();
    expect(screen.getByText('Request Updates')).toBeInTheDocument();
    expect(screen.getByText('Publish')).toBeInTheDocument();
  });

  test('adds a new row when "+ Row" button is clicked', () => {
    renderSheet();
    const addRowButton = screen.getByText('+ Row');
    fireEvent.click(addRowButton);
    expect(addRowData).toHaveBeenCalled();
  });

  test('deletes a row when "- Row" button is clicked', () => {
    renderSheet();
    const deleteRowButton = screen.getByText('- Row');
    fireEvent.click(deleteRowButton);
    expect(deleteRowData).toHaveBeenCalled();
  });

  test('adds a new column when "+ Column" button is clicked', () => {
    renderSheet();
    const addColButton = screen.getByText('+ Column');
    fireEvent.click(addColButton);
    expect(addColData).toHaveBeenCalled();
  });

  test('deletes a column when "- Column" button is clicked', () => {
    renderSheet();
    const deleteColButton = screen.getByText('- Column');
    fireEvent.click(deleteColButton);
    expect(deleteColData).toHaveBeenCalled();
  });

  test('updates cell value', () => {
    renderSheet();
    const cell = screen.getByTestId('$A1'); // Assuming data-testid is set for each cell
    fireEvent.change(cell, { target: { value: 'New Value' } });
    expect(sheetData['$A1']).toBe('New Value');
  });

  test('requests updates when "Request Updates" button is clicked', async () => {
    renderSheet();
    const requestUpdatesButton = screen.getByText('Request Updates');
    fireEvent.click(requestUpdatesButton);
    await waitFor(() => expect(fetchWithAuth).toHaveBeenCalled());
  });

  test('publishes updates when "Publish" button is clicked', async () => {
    renderSheet();
    const publishButton = screen.getByText('Publish');
    fireEvent.click(publishButton);
    await waitFor(() => expect(fetchWithAuth).toHaveBeenCalled());
  });
});

/**
 * Defines global types and common objects for the client.
 * 
 * @author kris-amerman
 */

// All recognized API endpoints.
export const validEndpoints = [
    "register",
    "getPublishers",
    "getSheets",
    "createSheet",
    "deleteSheet",
    "getUpdatesForSubscription",
    "getUpdatesForPublished",
    "updatePublished",
    "updateSubscription",
] as const;

// Represents data stored in the sheet as a mapping of REF:TERM pairs. 
export interface SheetDataMap {
    [ref: string]: string;
}

// Represents the client's relationship to this sheet.
export type SheetRelationship = "OWNER" | "SUBSCRIBER";

// Represents a valid getUpdates... endpoint.
export type GetUpdatesEndpoint = "getUpdatesForSubscription" | "getUpdatesForPublished";

// Represents a valid endpoint.
export type Endpoint = (typeof validEndpoints)[number];
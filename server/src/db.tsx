import { RowDataPacket } from "mysql2"

interface GetSheetRow extends RowDataPacket {
  sheetid: number;
  sheetname: string;
  latest?: string;
}

interface GetPublisherRow extends RowDataPacket {
  username: string;
}

interface GetSubscriberRow extends RowDataPacket {
  username: string;
}

/**
 * Creates the main tables in the dev db.
 *
 * @author hunterbrodie
 */
USE dev;

CREATE TABLE IF NOT EXISTS publishers (
	userid INT NOT NULL AUTO_INCREMENT,
  username TEXT NOT NULL,
  pass TEXT NOT NULL,
  isPublisher BOOLEAN NOT NULL DEFAULT 0,
  PRIMARY KEY (userid)
);

CREATE TABLE IF NOT EXISTS sheets (
  sheetid INT NOT NULL AUTO_INCREMENT,
  sheetname TEXT NOT NULL,
  owner INT NOT NULL,
  latest TEXT,
  PRIMARY KEY (sheetid),
  FOREIGN KEY (owner) REFERENCES publishers(userid)
);

CREATE TABLE IF NOT EXISTS updates (
  updateid INT NOT NULL AUTO_INCREMENT,
  updatetime TEXT NOT NULL,
  sheet INT NOT NULL,
  owner INT NOT NULL,
  changes TEXT NOT NULL,
  accepted BOOLEAN,
  PRIMARY KEY(updateid),
  FOREIGN KEY (sheet) REFERENCES sheets(sheetid) ON DELETE CASCADE,
  FOREIGN KEY (owner) REFERENCES publishers(userid)
);

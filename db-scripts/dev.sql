/**
 * Creates the main tables in the dev db.
 * @author {hunterbrodie}
 */
USE dev;

CREATE TABLE IF NOT EXISTS publishers (
	userid INT NOT NULL AUTO_INCREMENT,
  username TEXT NOT NULL,
  pass TEXT NOT NULL,
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
  PRIMARY KEY(updateid),
  FOREIGN KEY (sheet) REFERENCES sheets(sheetid),
  FOREIGN KEY (owner) REFERENCES publishers(userid)
);

CREATE TABLE IF NOT EXISTS subscribers (
	subid INT NOT NULL AUTO_INCREMENT,
  sub INT NOT NULL,
  sheet INT NOT NULL,
  PRIMARY KEY(subid),
  FOREIGN KEY(sub) REFERENCES publishers(userid),
  FOREIGN KEY(sheet) REFERENCES sheets(sheetid)
);

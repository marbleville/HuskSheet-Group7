/**
 * Creates the main tables in the testing db and instantiates some testing data.
 * @author {hunterbrodie}
 */
USE testing;

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
  accepted BOOLEAN,
  PRIMARY KEY(updateid),
  FOREIGN KEY (sheet) REFERENCES sheets(sheetid) ON DELETE CASCADE,
  FOREIGN KEY (owner) REFERENCES publishers(userid)
);

CREATE TABLE IF NOT EXISTS subscribers (
	subid INT NOT NULL AUTO_INCREMENT,
  sub INT NOT NULL,
  sheet INT NOT NULL,
  PRIMARY KEY(subid),
  FOREIGN KEY(sub) REFERENCES publishers(userid),
  FOREIGN KEY(sheet) REFERENCES sheets(sheetid) ON DELETE CASCADE
);

/**
 * Insert test data for testing database
 * @author{hunterbrodie}
 */
INSERT INTO
	publishers (username, pass)
VALUES
	('rishav', '123'),
	('laurence', '123'),
	('kris', '123'),
	('eduardo', '123'),
	('hunter', '123');

INSERT INTO
	sheets (sheetname, owner)
VALUES
	('test1', 1),
	('test2', 2),
	('test3', 5),
  ('test4', 5);

INSERT INTO
	subscribers (sub, sheet)
VALUES
	(2, 1),
  (4, 2),
  (3, 2);

INSERT INTO
  updates (updatetime, sheet, owner, changes)
VALUES
  ('1717535133', 1, 1, '$A1 1\n$a2 "help"\n'),
  ('1717535133', 2, 2, '$A1 1\n$a2 "help"\n$B1 -1.01\n$C4 ""\n$c1 = SUM($A1:$B1)'),
  ('1717535133', 3, 5, '$A1 1\n$a2 "help"\n$B1 -1.01\n$C4 ""\n$c1 = SUM($A1:$B1)'),
  ('1717535133', 3, 5, '$A1 2\n'),
  ('1717535133', 3, 4, '$A2 "helping"\n');
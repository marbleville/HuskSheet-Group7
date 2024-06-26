/**
 * Stores a procedure on the MySQL database to reset the testing database.
 *
 * @author huntebrodie
 */
DROP PROCEDURE IF EXISTS resetdata;

DELIMITER $$
CREATE PROCEDURE resetdata()
BEGIN
  SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE TABLE updates;
  TRUNCATE TABLE sheets;
  TRUNCATE TABLE publishers;
  SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO
	publishers (username, pass, isPublisher)
VALUES
	('rishav', '123', 1),
	('laurence', '123', 1),
	('kris', '123', 1),
	('eduardo', '123', 1),
	('hunter', '123', 1),
  ('caroline', '123', 0);

INSERT INTO
	sheets (sheetname, owner)
VALUES
	('test1', 1),
	('test2', 2),
	('test3', 5),
  ('test4', 5),
  ('test5-private', 5);

INSERT INTO
  updates (updatetime, sheet, owner, changes, accepted)
VALUES
  ('1717535133', 1, 1, '$A1 1\n$a2 "help"\n', TRUE),
  ('1717535133', 2, 2, '', TRUE),
  ('1717535133', 3, 5, '$A1 1\n$a2 "help"\n$B1 -1.01\n$C4 ""\n$c1 = SUM($A1:$B1)', TRUE),
  ('1717535133', 3, 5, '$A1 2\n', TRUE),
  ('1717535133', 3, 4, '$A2 "helping"\n', FALSE);
END$$

DELIMITER ;

CALL resetdata();

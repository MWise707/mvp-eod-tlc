DROP TABLE IF EXISTS platoons;

CREATE TABLE platoons (
  platoon_id SERIAL PRIMARY KEY,
  platoon_name VARCHAR,
  company TEXT,
  capacity INTEGER
);

INSERT INTO platoons (platoon_id, platoon_name, company, capacity) VALUES (default, '1st Platoon', '707TH EOD', 11);
INSERT INTO platoons (platoon_id, platoon_name, company, capacity) VALUES (default, '2nd Platoon', '707TH EOD', 11);
INSERT INTO platoons (platoon_id, platoon_name, company, capacity) VALUES (default, '3rd Platoon', '707TH EOD', 11);
INSERT INTO platoons (platoon_id, platoon_name, company, capacity) VALUES (default, 'HQ Platoon', '707TH EOD', 11);
INSERT INTO platoons (platoon_id, platoon_name, company, capacity) VALUES (default, 'UNASSIGNED', '707TH EOD', 11);

DROP TABLE IF EXISTS teams;

CREATE TABLE teams (
  team_id SERIAL PRIMARY KEY,
  team_name TEXT,
  platoon_id INTEGER REFERENCES platoons (platoon_id)
);

INSERT INTO teams (team_id, team_name, platoon_id) VALUES (default, '1-1', 1);
INSERT INTO teams (team_id, team_name, platoon_id) VALUES (default, '1-2', 1);
INSERT INTO teams (team_id, team_name, platoon_id) VALUES (default, '1-3', 1);
INSERT INTO teams (team_id, team_name, platoon_id) VALUES (default, '2-1', 2);
INSERT INTO teams (team_id, team_name, platoon_id) VALUES (default, '2-2', 2);
INSERT INTO teams (team_id, team_name, platoon_id) VALUES (default, '2-3', 2);
INSERT INTO teams (team_id, team_name, platoon_id) VALUES (default, '3-1', 3);
INSERT INTO teams (team_id, team_name, platoon_id) VALUES (default, '3-2', 3);
INSERT INTO teams (team_id, team_name, platoon_id) VALUES (default, '3-3', 3);

DROP TABLE IF EXISTS techs;

CREATE TABLE techs (
  tech_id SERIAL PRIMARY KEY,
  rank TEXT,
  first_name TEXT,
  last_name TEXT,
  position TEXT,
  is_tlc_complete BOOLEAN,
  percent_complete DECIMAL,
  platoon_id INTEGER,
  team_id INTEGER,
  is_officer BOOLEAN,
  badge_level TEXT CONSTRAINT badge_name CHECK (badge_level = 'MASTER' OR badge_level = 'SENIOR' OR badge_level = 'BASIC')
);

INSERT INTO techs (tech_id, rank, first_name, last_name, position, is_tlc_complete, percent_complete, platoon_id, team_id, is_officer, badge_level) VALUES (default, 'SSG', 'Greg', 'Johnson', 'Team Leader', true, NULL, 1, 1, false, 'MASTER');
INSERT INTO techs (tech_id, rank, first_name, last_name, position, is_tlc_complete, percent_complete, platoon_id, team_id, is_officer, badge_level) VALUES (default, 'SGT', 'Bob', 'Gregory', 'Senior Team Member', true, NULL, 1, 1, false, 'SENIOR');
INSERT INTO techs (tech_id, rank, first_name, last_name, position, is_tlc_complete, percent_complete, platoon_id, team_id, is_officer, badge_level) VALUES (default, 'SPC', 'Chris', 'Thompson', 'Team Member', false, .25, 1, 1, false, 'BASIC');
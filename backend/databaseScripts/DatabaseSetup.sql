CREATE TABLE boxes (
    _id SERIAL PRIMARY KEY,
    length INT NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    material VARCHAR (50) NOT NULL,
    color VARCHAR (50) NOT NULL
);
GO;

CREATE TABLE wrappers (
    _id SERIAL PRIMARY KEY,
    length INT NOT NULL,
    width INT NOT NULL,
    color VARCHAR (50) NOT NULL,
    complementaryColor VARCHAR (50) NOT NULL,
    pattern VARCHAR (50) NOT NULL
);
GO;

CREATE TABLE suppliers (
    _id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    address VARCHAR (255) NOT NULL,
    phone VARCHAR (20) NOT NULL,
    email VARCHAR (255) NOT NULL
);

CREATE TABLE suppliedWrappers (
    supplierId INT NOT NULL,
    wrapperId INT NOT NULL,
    FOREIGN KEY (supplierId) REFERENCES suppliers (_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (wrapperId) REFERENCES wrappers (_id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY (supplierId, wrapperId)
);
GO;

DROP TABLE combos;
GO;

CREATE TABLE combos (
    _id SERIAL PRIMARY KEY,
    boxId INT NOT NULL,
    wrapperId INT NOT NULL,
    FOREIGN KEY (boxId) REFERENCES boxes (_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (wrapperId) REFERENCES wrappers (_id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR (255) NOT NULL,
    price FLOAT NOT NULL
);
GO;

-- SELECT w.* 
-- FROM wrappers w 
-- JOIN suppliedWrappers sw ON w._id = sw.wrapperId 
-- WHERE sw.supplierId = 1


-- EXPLAIN ANALYZE SELECT COUNT(*) FROM boxes LIMIT 1;
-- EXPLAIN ANALYZE SELECT COUNT(*) FROM boxes;

CREATE INDEX idx_boxes_id ON boxes (_id);
GO;
CREATE INDEX idx_wrappers_id ON wrappers (_id);
GO;
CREATE INDEX idx_suppliers_id ON suppliers (_id);
GO;
CREATE INDEX idx_suppliedWrappers_supplierId ON suppliedWrappers (supplierId);
GO;
CREATE INDEX idx_suppliedWrappers_wrapperId ON suppliedWrappers (wrapperId);
GO;
CREATE INDEX idx_combos_id ON combos (_id);
GO;

CREATE INDEX idx_boxes_size ON boxes (width, height, length);
GO;

-- EXPLAIN ANALYZE
-- SELECT * FROM boxes 
-- WHERE width > 40 OR height > 40 OR length > 40; -- faster

-- EXPLAIN ANALYZE
-- SELECT * FROM boxes 
-- WHERE GREATEST(width, height, length) > 40; -- slower

-- DELETE FROM wrappers WHERE _id < 29;

-- Create a variable to cache the count
CREATE OR REPLACE FUNCTION update_combo_count() RETURNS TRIGGER AS $$
DECLARE
  count INTEGER;
BEGIN
  -- Count the number of rows in the combos table
  SELECT COUNT(*) INTO count FROM combos;
  -- Update the value of the cached variable
  PERFORM pg_advisory_xact_lock(42);
  UPDATE cache_table SET value = count WHERE key = 'combos_count';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
GO;

-- Create the trigger on the combos table
CREATE TRIGGER count_combos_trigger AFTER INSERT OR UPDATE OR DELETE ON combos
  FOR EACH STATEMENT EXECUTE FUNCTION update_combo_count();

-- Create the cache table
CREATE TABLE cache_table (
  key VARCHAR(255) PRIMARY KEY,
  value BIGINT NOT NULL
);
GO;

-- Insert the initial value into the cache table
-- SELECT COUNT(*) FROM combos;
INSERT INTO cache_table (key, value) VALUES ('combos_count', 
    (SELECT COUNT(*) FROM combos)
);
GO;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR (255) NOT NULL,
    passwordhash VARCHAR (255) NOT NULL,
    role VARCHAR (50) NOT NULL DEFAULT 'user'
);
GO;

CREATE TABLE box_owners (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    boxid INT NOT NULL UNIQUE,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (boxid) REFERENCES boxes (_id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO;

CREATE TABLE wrapper_owners (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    wrapperid INT NOT NULL UNIQUE,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (wrapperid) REFERENCES wrappers (_id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO;

CREATE TABLE supplier_owners (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    supplierid INT NOT NULL UNIQUE,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (supplierid) REFERENCES suppliers (_id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO;

CREATE TABLE combo_owners (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    comboid INT NOT NULL UNIQUE,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (comboid) REFERENCES combos (_id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO;

CREATE TABLE userdetails (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    email VARCHAR (255),
    birthday DATE,
    gender VARCHAR (50),
    nickname VARCHAR (255),
    eyecolor VARCHAR (50),
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO;

CREATE OR REPLACE FUNCTION populate_userdetails()
RETURNS VOID AS $$
DECLARE
    user_row RECORD;
    email_suffix VARCHAR(50);
    nickname VARCHAR(255);
    eyecolor VARCHAR(50);
    gender VARCHAR(50);
    colors CONSTANT VARCHAR[] := ARRAY['blue', 'green', 'brown', 'white', 'black', 'multicolored'];
    genders CONSTANT VARCHAR[] := ARRAY['Male', 'Female', 'Non-Binary'];
    email_suffixes CONSTANT VARCHAR[] := ARRAY['@gmail.com', '@yahoo.com', '@outlook.com'];
    birthday DATE;
BEGIN
    FOR user_row IN SELECT id, username FROM users
    LOOP
        -- Set email suffix based on the domain of the user's email address
        email_suffix := email_suffixes[floor(random()*3)+1];

        -- Set nickname based on the user's username
        nickname := regexp_replace(user_row.username, '[_]', ' ', 'g');
        nickname := regexp_replace(nickname, '[0-9]', '', 'g');
        nickname := initcap(nickname);

        -- Set eyecolor randomly from a list of possible values
        eyecolor := colors[floor(random()*6)+1];

        -- Set Gender randomly from a list of possible values
        gender := genders[floor(random()*3)+1];

        -- Set birthday randomly from a range of possible values
        birthday := '1990-01-01'::date + floor(random()*365*20+1) * '1 day'::interval;

        -- Insert new row into userdetails table
        INSERT INTO userdetails (userid, email, birthday, gender, nickname, eyecolor)
        VALUES (user_row.id, user_row.username || email_suffix, 
            birthday, 
            gender,
            nickname,
            eyecolor);
    END LOOP;
END;
$$ LANGUAGE plpgsql;
GO;

SELECT populate_userdetails();
GO;

CREATE INDEX box_owners_userid_idx ON box_owners (userid);
GO;
CREATE INDEX wrapper_owners_userid_idx ON wrapper_owners (userid);
GO;
CREATE INDEX supplier_owners_userid_idx ON supplier_owners (userid);
GO;
CREATE INDEX combo_owners_userid_idx ON combo_owners (userid);
GO;

CREATE INDEX box_owners_boxid_idx ON box_owners (boxid);
GO;
CREATE INDEX wrapper_owners_wrapperid_idx ON wrapper_owners (wrapperid);
GO;
CREATE INDEX supplier_owners_supplierid_idx ON supplier_owners (supplierid);
GO;
CREATE INDEX combo_owners_comboid_idx ON combo_owners (comboid);
GO;

CREATE INDEX userdetails_userid_idx ON userdetails (userid);
GO;

-- UPDATE users SET role = 'admin' WHERE username = 'admin';
-- UPDATE users SET role = 'moderator' WHERE username = 'moderator';
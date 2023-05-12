CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR (255) NOT NULL,
    passwordhash VARCHAR (255) NOT NULL
)

CREATE TABLE jwt (
    id SERIAL PRIMARY KEY,
    token VARCHAR (255) NOT NULL,
    date TIMESTAMP NOT NULL,
    CONSTRAINT check_jwt_age CHECK (date >= now() - interval '10 minutes')
);

-- CREATE TABLE tempusers (
--     id SERIAL PRIMARY KEY,
--     username VARCHAR (255) NOT NULL,
--     passwordhash VARCHAR (255) NOT NULL,
--     jwt_token INT NOT NULL,
--     FOREIGN KEY (jwt_token) REFERENCES jwt (id) ON DELETE CASCADE ON UPDATE CASCADE
-- )

CREATE OR REPLACE FUNCTION delete_old_jwt()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM jwt WHERE date < now() - interval '10 minutes';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jwt_delete_trigger
AFTER INSERT ON jwt
EXECUTE FUNCTION delete_old_jwt();

DROP TABLE jwt;
DROP TABLE tempusers;
DROP FUNCTION delete_old_jwt();
DROP TRIGGER jwt_delete_trigger ON jwt;

SELECT * FROM users;

SELECT * FROM users WHERE username = testuser;

CREATE TABLE box_owners (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    boxid INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (boxid) REFERENCES boxes (_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE wrapper_owners (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    wrapperid INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (wrapperid) REFERENCES wrappers (_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE supplier_owners (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    supplierid INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (supplierid) REFERENCES suppliers (_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE combo_owners (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    comboid INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (comboid) REFERENCES combos (_id) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE box_owners ADD CONSTRAINT box_unique UNIQUE (boxid);
ALTER TABLE wrapper_owners ADD CONSTRAINT wrapper_unique UNIQUE (wrapperid);
ALTER TABLE supplier_owners ADD CONSTRAINT supplier_unique UNIQUE (supplierid);
ALTER TABLE combo_owners ADD CONSTRAINT combo_unique UNIQUE (comboid);

SELECT count(*) FROM wrapper_owners;
-- DELETE from box_owners WHERE id > 1000000;

CREATE TABLE userdetails (
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    email VARCHAR (255) NOT NULL,
    birthday DATE NOT NULL,
    gender VARCHAR (50) NOT NULL,
    nickname VARCHAR (255) NOT NULL,
    eyecolor VARCHAR (50) NOT NULL,
    FOREIGN KEY (userid) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);


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
    FOR user_row IN SELECT id, username FROM users LIMIT 1
    LOOP
        -- Set email suffix based on the domain of the user's email address
        email_suffix := email_suffixes[floor(random()*3)+1];
        
        -- Set nickname based on the user's username
        nickname := regexp_replace(user_row.username, '_', ' ', 'g');
        nickname := regexp_replace(user_row.username, '[0-9]', '', 'g');
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

SELECT populate_userdetails();
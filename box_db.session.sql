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

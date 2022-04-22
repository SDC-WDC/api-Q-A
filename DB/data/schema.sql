CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  q_body TEXT NOT NULL,
  q_date_written TEXT NOT NULL,
  asker_name TEXT NOT NULL,
  asker_email TEXT NOT NULL,
  q_reported INT NOT NULL,
  q_helpful INT NOT NULL
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  question_id INT NOT NULL REFERENCES questions(id),
  body TEXT NOT NULL,
  date_written TEXT NOT NULL,
  answerer_name TEXT NOT NULL,
  answerer_email TEXT NOT NULL,
  reported INT NOT NULL,
  helpful INT NOT NULL
);

ALTER TABLE answers ADD COLUMN aId SERIAL;

UPDATE answers SET aId = id;

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL REFERENCES answers(id),
  url TEXT NOT NULL
);
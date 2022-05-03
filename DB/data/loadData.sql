COPY questions FROM '/Users/kunchen/Documents/HackReactor/SDC/api-Q-A/DB/data/questions.csv' DELIMITER ',' CSV HEADER;

COPY answers FROM '/Users/kunchen/Documents/HackReactor/SDC/api-Q-A/DB/data/answers.csv' DELIMITER ',' CSV HEADER;

COPY photos FROM '/Users/kunchen/Documents/HackReactor/SDC/api-Q-A/DB/data/answers_photos.csv' DELIMITER ',' CSV HEADER;

SELECT setval('questions_id_seq', coalesce(max(id), 0) + 1, false) FROM questions;

SELECT setval('answers_id_seq', coalesce(max(id), 0) + 1, false) FROM answers;

SELECT setval('photos_id_seq', coalesce(max(id), 0) + 1, false) FROM photos;

ALTER TABLE questions ADD COLUMN qId SERIAL;

UPDATE questions SET qId = id;

ALTER TABLE answers ADD COLUMN aId SERIAL;

UPDATE answers SET aId = id;

CREATE INDEX questions_id_index ON questions (id);

CREATE INDEX questions_product_id_index ON questions (product_id);

CREATE INDEX answers_id_index ON answers (id);

CREATE INDEX answers_question_id_index ON answers (question_id);

CREATE INDEX photos_id_index ON photos (id);

CREATE INDEX photos_answer_id_index ON photos (answer_id);


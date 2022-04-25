COPY questions (
  id,
  product_id,
  q_body,
  q_date_written,
  asker_name,
  asker_email,
  q_reported,
  q_helpful
) FROM '/Users/kunchen/Documents/HackReactor/SDC2/api-Q-A/DB/data/questions.csv' DELIMITER ',' CSV HEADER;

COPY answers (
  id,
  question_id,
  body,
  date_written,
  answerer_name,
  answerer_email,
  reported,
  helpful
) FROM '/Users/kunchen/Documents/HackReactor/SDC2/api-Q-A/DB/data/answers.csv' DELIMITER ',' CSV HEADER;

COPY photos (
  id,
  answer_id,
  url
) FROM '/Users/kunchen/Documents/HackReactor/SDC2/api-Q-A/DB/data/answers_photos.csv' DELIMITER ',' CSV HEADER;

CREATE INDEX questions_id_index ON questions (id);

CREATE INDEX questions_product_id_index ON questions (product_id);

CREATE INDEX answers_id_index ON answers (id);

CREATE INDEX answers_question_id_index ON answers (question_id);

CREATE INDEX photos_id_index ON photos (id);

CREATE INDEX photos_answer_id_index ON photos (answer_id);


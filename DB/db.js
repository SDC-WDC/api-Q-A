const { Pool } = require('pg');

const pool = new Pool({
  user: 'kunchen',
  host: 'localhost',
  database: 'questionsandanswers',
  password: '',
  port: 5432,
})

const fetchQandA = (product_id, cb) => {
  pool.query(`SELECT * FROM questions WHERE product_id = ${product_id}`)
    .then((results) => {
      cb(results.rows);
    })
}

const saveQuestion = (questionPost, cb) => {
  pool.query('INSERT INTO questions (product_id, body, date_written, asker_name, asker_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, $6, $7)', questionPost, (error, results) => {
    if (error) {
      throw error
    }
    cb();
  })
}

const saveAnswer = (answerPost, photo_url, cb) => {
  pool.query('INSERT INTO answers (question_id, body, date_written, answerer_name, answerer_email, reported, helpful) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id', answerPost, (error, results) => {
    if (error) {
      throw error
    }
    cb();
    //add pictures to database
    let answer_id = results.rows[0].id;
    for (let i = 0; i < photo_url.length; i++) {
      let photoPost = [answer_id, photo_url[i]]
      pool.query('INSERT INTO photos (answer_id, url) VALUES ($1, $2)', photoPost, (error, results) => {
        if (error) {
          throw error
        }
        console.log('add pictures successful')
      })
    }
  })
}

const helpfulQuestion = () => {

}

const helpfulAnswer = () => {

}

const reportQuestion = () => {

}

const reportAnswer = () => {

}

module.exports.fetchQandA = fetchQandA;
module.exports.saveQuestion = saveQuestion;
module.exports.saveAnswer = saveAnswer;
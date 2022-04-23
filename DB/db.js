const { Pool } = require('pg');

const pool = new Pool({
  user: 'kunchen',
  host: 'localhost',
  database: 'questionsandanswers',
  password: '',
  port: 5432,
})

const fetchQandA = (product_id, cb) => {
  pool.query(`SELECT * FROM questions LEFT JOIN answers ON questions.id = answers.question_id LEFT JOIN photos ON answers.id = photos.answer_id WHERE questions.product_id = ${product_id}`)
    .then((results) => {
      var output = {product_id: results.rows[0].product_id.toString(), results: []}
      var questionId = [];
      var answerId = [];
      var j = 0;
      for (let i = 0; i < results.rows.length; i++) {
        if (questionId.indexOf(results.rows[i].qid) === -1) {
          questionId.push(results.rows[i].qid);
          output.results.push({
            question_id: results.rows[i].qid,
            question_body: results.rows[i].q_body,
            question_date: new Date(parseInt(results.rows[i].q_date_written)),
            asker_name: results.rows[i].asker_name,
            question_helpfulness: results.rows[i].q_helpful,
            reported: results.rows[i].q_reported === 0 ? false : true,
            answers: {},
          })
           if (results.rows[i].aid !== null) {
            output.results[j].answers[results.rows[i].aid] = {
              id: results.rows[i].aid,
              body: results.rows[i].body,
              date: new Date(parseInt(results.rows[i].date_written)),
              answerer_name: results.rows[i].answerer_name,
              helpfulness: results.rows[i].helpful,
              photos: []
            }
            if (results.rows[i].url !== null) {
              output.results[j].answers[results.rows[i].aid].photos.push(results.rows[i].url);
            }
            answerId.push(results.rows[i].aid);
           }
          j++;
        } else {
          let index = questionId.indexOf(results.rows[i].qid);
          if (answerId.indexOf(results.rows[i].aid) === -1) {
            output.results[index].answers[results.rows[i].aid] = {
              id: results.rows[i].aid,
              body: results.rows[i].body,
              date: new Date(parseInt(results.rows[i].date_written)),
              answerer_name: results.rows[i].answerer_name,
              helpfulness: results.rows[i].helpful,
              photos: []
            }
            answerId.push(results.rows[i].aid);
            if (results.rows[i].url !== null) {
              output.results[index].answers[results.rows[i].aid].photos.push(results.rows[i].url);
            }
          }
          else {
            let index = questionId.indexOf(results.rows[i].qid);
            if (results.rows[i].url !== null) {
              output.results[index].answers[results.rows[i].aid].photos.push(results.rows[i].url);
            }
          }
        }
      }
      cb(output);
    })
    .catch((err) => console.log('fail to load', err))
}

const saveQuestion = (questionPost, cb) => {
  pool.query('INSERT INTO questions (product_id, q_body, q_date_written, asker_name, asker_email, q_reported, q_helpful) VALUES ($1, $2, $3, $4, $5, $6, $7)', questionPost, (error, results) => {
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

const helpfulQuestion = (question_id, cb) => {
  pool.query(`UPDATE questions SET q_helpful = q_helpful + 1 WHERE id = ${question_id}`)
    .then(() => {
      cb();
    })
    .catch((err) => console.log('fail to increment', err))
}

const helpfulAnswer = (answer_id, cb) => {
  pool.query(`UPDATE answers SET helpful = helpful + 1 WHERE id = ${answer_id}`)
    .then(() => {
      cb();
    })
    .catch((err) => console.log('fail to increment', err))
}

const reportQuestion = (question_id, cb) => {
  pool.query(`UPDATE questions SET q_reported = 1 WHERE id = ${question_id}`)
    .then(() => {
      cb();
    })
    .catch((err) => console.log('fail to update', err))
}

const reportAnswer = (answer_id, cb) => {
  pool.query(`UPDATE answers SET reported = 1 WHERE id = ${answer_id}`)
    .then(() => {
      cb();
    })
    .catch((err) => console.log('fail to update', err))
}

module.exports.fetchQandA = fetchQandA;
module.exports.saveQuestion = saveQuestion;
module.exports.saveAnswer = saveAnswer;
module.exports.helpfulQuestion = helpfulQuestion;
module.exports.helpfulAnswer = helpfulAnswer;
module.exports.reportAnswer = reportAnswer;
module.exports.reportQuestion = reportQuestion;
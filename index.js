const express = require('express');
const port = 5005;
const app = express();
const db = require('./DB/db.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/qa*', (req, res) => {
  let product_id = req.query.product_id;
  let count = req.query.count === undefined ? 5 : req.query.count;
  let page = req.query.page === undefined ? 1 : req.query.page;

  db.fetchQandA(product_id, (results) => {
    res.json(results)
  });
})

app.post('/qa/questions', (req, res) => {
  let questionPost = [req.body.product_id, req.body.body, new Date(), req.body.name, req.body.email, 0, 0];
  db.saveQuestion(questionPost, () => {
    res.status(201).send('your question post successful');
  });
})

app.post('/qa/questions/*/answers', (req, res) => {
  let question_id = req.params['0'];
  let answerPost = [question_id, req.body.body, new Date(), req.body.name, req.body.email, 0, 0];
  db.saveAnswer(answerPost, req.body.photos, () => {
    res.status(201).send('your answer post successful');
  });
})

app.put('/qa/questions/*/helpful', (req, res) => {
  let question_id = req.params['0'];
  db.helpfulQuestion(question_id, () => {
    res.status(201).send('Thank you to vote for this question');
  });
  console.log('helpful question', question_id)
})

app.put('/qa/questions/*/report', (req, res) => {
  let question_id = req.params['0'];
  db.reportQuestion(question_id, () => {
    res.status(201).send('Reported');
  });
  console.log('report question', question_id)
})

app.put('/qa/answers/*/helpful', (req, res) => {
  let answer_id = req.params['0'];
  db.helpfulAnswer(answer_id, () => {
    res.status(201).send('Thank you to vote for this answer');
  });
  console.log('helpful answer', answer_id)
})

app.put('/qa/answers/*/report', (req, res) => {
  let answer_id = req.params['0'];
  db.reportAnswer(answer_id, () => {
    res.status(201).send('Reported');
  });
  console.log('report answer', answer_id)
})




app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
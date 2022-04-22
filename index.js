const express = require('express');
const port = 3000;
const app = express();
const db = require('./DB/db.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const qaData = {
  "product_id": "5",
  "results": [{
        "question_id": 37,
        "question_body": "Why is this product cheaper here than other sites?",
        "question_date": "2018-10-18T00:00:00.000Z",
        "asker_name": "williamsmith",
        "question_helpfulness": 4,
        "reported": false,
        "answers": {
          68: {
            "id": 68,
            "body": "We are selling it here without any markup from the middleman!",
            "date": "2018-08-18T00:00:00.000Z",
            "answerer_name": "Seller",
            "helpfulness": 4,
            "photos": []
            // ...
          }
        }
      },
      {
        "question_id": 38,
        "question_body": "How long does it last?",
        "question_date": "2019-06-28T00:00:00.000Z",
        "asker_name": "funnygirl",
        "question_helpfulness": 2,
        "reported": false,
        "answers": {
          70: {
            "id": 70,
            "body": "Some of the seams started splitting the first time I wore it!",
            "date": "2019-11-28T00:00:00.000Z",
            "answerer_name": "sillyguy",
            "helpfulness": 6,
            "photos": [],
          },
          78: {
            "id": 78,
            "body": "9 lives",
            "date": "2019-11-12T00:00:00.000Z",
            "answerer_name": "iluvdogz",
            "helpfulness": 31,
            "photos": [],
          }
        }
      },
      // ...
  ]
}

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
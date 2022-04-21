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
  let product_id = req.originalUrl.split('product_id=')[1];
  let indexAfterId;
  for (let i = 0; i < product_id.length; i ++) {
    if (product_id[i] === '&') {
      indexAfterId = i;
      break;
    }
  }
  product_id = product_id.slice(0, indexAfterId);

  // console.log(product_id)
  // db.fetchQandA(product_id, (results) => {
  //   res.send(results)
  // });
  res.send(qaData)
})

app.post('/qa/questions', (req, res) => {
  let questionPost = [req.body.product_id, req.body.body, new Date(), req.body.name, req.body.email, 0, 0];
  db.saveQuestion(questionPost, () => {
    res.status(201).send('your question post successful');
  });
})

app.post('/qa/questions/*/answers', (req, res) => {
  let question_id = parseInt(req.url.split('/')[3]);
  let answerPost = [question_id, req.body.body, new Date(), req.body.name, req.body.email, 0, 0];
  db.saveAnswer(answerPost, req.body.photos, () => {
    res.status(201).send('your answer post successful');
  });
})

app.put('/qa/questions/*/helpful', (req, res) => {
  console.log('helpful')
})

app.put('/qa/questions/*/report', (req, res) => {
  console.log('report')
})

app.put('/qa/answers/*/helpful', (req, res) => {
  console.log('helpful')
})

app.put('/qa/answers/*/report', (req, res) => {
  console.log('report')
})




app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
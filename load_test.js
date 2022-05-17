import http from 'k6/http';
import {sleep} from 'k6';

// * Configuration
export let options = {
  // no certificate, so ignore
  insecureSkipTLSVerify: true,
  // this one is for the socket, not need to worry
  noConnectionReuse: false,
  stages: [
    {duration:'1m',target:1000}, // simulate ramp-up of traffic from 1 to 1000 users over 1 minutes
    {duration:'2m',target:1000},// stay at 1000 users for 2 m
    {duration:'1m',target:0},   // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<50'], // 99% of requests must complete below 50ms.
  }
};

const URL = 'http://50.18.22.164:5005';

const postQBody = {
  body: 'good',
  name: 'tester',
  email: 'tester@test.com',
  product_id: 66642,
};

const postABody = {
  body: 'good',
  name: 'tester',
  email: 'tester@test.com',
  photos: 'photo_url',
};

export default () => {

  http.batch([
    ['GET', `${URL}/qa/questions?product_id=66643&count=500`],
    ['GET', `${URL}/qa/questions?product_id=66642&count=500`],
    ['POST', `${URL}/qa/questions`, postQBody],
    ['PUT', `${URL}/qa/questions/561324/helpful`],
    ['PUT', `${URL}/qa/questions/785411/report`],
    ['PUT', `${URL}/qa/questions/243463/helpful`],
    ['POST', `${URL}/qa/questions/325536/answers`, postABody],
    ['PUT', `${URL}/qa/answers/24346/helpful`],
    ['PUT', `${URL}/qa/answers/24346/report`],
    ['GET', `${URL}/qa/questions?product_id=66646&count=500`],
    ['GET', `${URL}/qa/questions?product_id=66645&count=500`],
  ])

  sleep(1);
}
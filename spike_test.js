// Spike test does not gradually increase the load
// Instead, it spikes to extreme load over a very short window of time

/*
Run a spike test to:
- Determine how your system will perform under a sudden surge of traffic
- Determine if your system will recover once the traffic has subsided

Success is based on expectations. Systems will generally react in 1 of 4 ways
- Excellent : system performnce is not degraded during the surge of traffic.
  Response time is similar during low traffic and high traffic

  - Good: Response time is slower, but the system does not produce any errors
  All requests are handled

- Poor: System produces errors during the surge of traffic, but recovers to normal after the traffic subsided
- Bad: system crashes, and does not recover after the traffic has subsided
*/

import http from 'k6/http';
import {sleep} from 'k6';

// * Configuration
export let options = {
  // no certificate, so ignore
  insecureSkipTLSVerify: true,
  // this one is for the socket, not need to worry
  noConnectionReuse: false,
  stages: [
    {duration:'10s',target:100}, //below normal load
    {duration:'1m',target:1400}, // spike to 1400 users
    {duration:'3m',target:1400}, // stay at 1400 for 3 minutes
    {duration:'10s',target:100}, // scale down. Recovery stage.
  ]
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

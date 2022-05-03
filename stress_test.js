// stress testing is a type of flow test used to determine the limits of the system
// how far can we push it?
/*
!  purpose of stress testing:
*  -verify stability and reliability when the system is under extreme conditions
*  -Determine what is the maximum capacity of your system in terms of users or throughput
*  -Determine the breaking point of your system and its failure mode
*  -Determine if yoru system will recover without manual intervention after the sterss test is over
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
    // it's ramping up the users that will hammer the system with the test
    {duration:'1m',target:100}, //below normal load
    {duration:'1m',target:100},
    {duration:'1m',target:200}, // normal load
    {duration:'1m',target:200},
    {duration:'1m',target:500}, // around the breaking point
    {duration:'1m',target:500},
    {duration:'1m',target:1000}, // beyond the breaking point
    {duration:'1m',target:1000},
    {duration:'1m',target:0},  // scale down. Recovery stage.
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

/*

running (38m00.6s), 000/400 VUs, 219997 complete and 2 interrupted iterations
default ✓ [======================================] 000/400 VUs  38m0s

     data_received..............: 131 MB  58 kB/s
     data_sent..................: 40 MB   18 kB/s
     http_req_blocked...........: avg=11.55ms  min=0s med=1µs   max=25.72s p(90)=6µs    p(95)=285µs
     http_req_connecting........: avg=11.04ms  min=0s med=0s    max=19.52s p(90)=0s     p(95)=0s
     http_req_duration..........: avg=457.34ms min=0s med=559µs max=1m0s   p(90)=1.55ms p(95)=2.01ms
     http_req_failed............: 100.00% ✓ 439998     ✗ 0
     http_req_receiving.........: avg=13.96µs  min=0s med=11µs  max=2.62ms p(90)=25µs   p(95)=30µs
     http_req_sending...........: avg=819.4µs  min=0s med=4µs   max=31.06s p(90)=11µs   p(95)=17µs
     http_req_tls_handshaking...: avg=0s       min=0s med=0s    max=0s     p(90)=0s     p(95)=0s
     http_req_waiting...........: avg=456.51ms min=0s med=539µs max=32.17s p(90)=1.53ms p(95)=1.99ms
     http_reqs..................: 439998  192.932986/s
     iteration_duration.........: avg=2.35s    min=1s med=1s    max=1m1s   p(90)=1s     p(95)=1.4s
     iterations.................: 219997  96.465616/s
     vus........................: 1       min=1        max=400
     vus_max....................: 400     min=400      max=400


*/
import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter ('http_ reqs');
export const options = {
  vus: 100,
  duration: '15s'
  }

const url = 'http://localhost:3000/reviews/1';

export default function() {
const res = http.get(url);
sleep(1);
check(res, {
'is status 200': r => r.status === 200,
'transaction time < 5ms' : r => r.timings.duration < 5,
'transaction time < 10ms' : r => r.timings.duration < 10,
'transaction time < 20ms' : r => r.timings.duration < 20,
'transaction time < 30ms' : r => r.timings.duration < 30,
'transaction time < 50ms' : r => r.timings.duration < 50,
'transaction time < 100ms' : r => r.timings.duration < 100,
'transaction time < 200ms' : r => r.timings.duration < 200,
});
}
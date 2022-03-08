import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '15s'
};

export default function () {
  sleep(1);
  http.get('http://localhost:5000/api/reviews/4033');
}

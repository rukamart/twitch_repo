import test from 'tape'
import { shallow } from '@vue/test-utils'
import config from "../../../config/index";
import get from '../../../src/components/search/index.js'

test('Get Streams successfully', t => {
  t.plan(2)

  const url   = `https://api.twitch.tv/kraken/streams`;
  get.genericAxios(url, false, config.headers).then(results => {
    t.ok(results.streams, 'Should return streams');
    t.ok(results.streams.length > 0, `Should return more than 1 streams`);
  });
})

test('Get Streams successfully with limit', t => {
  t.plan(2)

  const limit = 2,
        url   = `https://api.twitch.tv/kraken/streams?limit=${limit}`;
  get.genericAxios(url, false, config.headers).then(results => {
    t.ok(results.streams, 'Should return streams');
    t.equals(results.streams.length, limit, `Should return ${limit} streams`);
  });
})

test('Get Streams successfully with specific word', t => {
  t.plan(1)

  const query = 'portugal',
        url   = `https://api.twitch.tv/kraken/search/streams?query=${query}`;
  get.genericAxios(url, false, config.headers).then(results => {
    t.ok(results.streams, `Should return streams with word ${query}`);
  });
})

test('Get Streams and fail', t => {
  t.plan(2)

  const url = `https://api.twitch.tv/kraken/errorr`;
  get.genericAxios(url, false, config.headers).then(results => {
    t.equals(results.response.status, 404, 'Should return 404');
    t.equals(results.response.statusText, 'Not Found', 'Should return Not Found');
  });
})

test('Get Streams with fake client-id and fail', t => {
  t.plan(2)

  const headers = {
    "Client-ID": "mockClient",
    "Accept": "application/vnd.twitchtv.v5+json"
  };

  const url   = `https://api.twitch.tv/kraken/streams`;
  get.genericAxios(url, false, headers).then(results => {
    t.equals(results.response.status, 400, 'Should return 400');
    t.equals(results.response.data.message, 'Invalid client id specified', 'Should return a client error message');
  });
})

import { expect, test } from 'bun:test';
import { requestThor } from '../src/thor';

function request(payload: unknown) {
  const fetcher = (() => Promise.resolve(Response.json(payload))) as typeof fetch;
  return requestThor('https://thor.example/storefront/graphql', {}, { operationName: 'ProductDetail' }, fetcher);
}

test.each([['null response', null], ['array data', { data: [] }]] as const)(
  'classifies HTTP 200 with %s as an invalid Thor response',
  async (_label, payload) => {
    await expect(request(payload)).rejects.toHaveProperty('code', 'THOR_RESPONSE_INVALID');
  },
);

test('preserves a valid operation result containing a null field', async () => {
  expect(await request({ data: { product: null } })).toEqual({ data: { product: null } });
});

test('keeps GraphQL errors distinct from invalid response shapes', async () => {
  await expect(request({ data: null, errors: [{ message: 'Upstream error' }] }))
    .rejects.toHaveProperty('code', 'THOR_GRAPHQL_ERROR');
});

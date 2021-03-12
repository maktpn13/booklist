const assert = require('assert');
const app = require('../../src/app');

describe('\'booklist\' service', () => {
  it('registered the service', () => {
    const service = app.service('booklist');

    assert.ok(service, 'Registered the service');
  });
});

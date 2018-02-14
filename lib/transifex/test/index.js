var assert = require('assert');
var transifex = require('../..').transifex;
var parse = transifex.parse;
var examples = transifex.examples;

describe('Transifex', function() {

  it('should generate a translation completed message', function() {
    var payload = examples['translation_completed'];

    var settings = {
      events: {
        translation_completed: true
      }
    };

    var response = parse(payload.headers, payload.body, settings);

    assert.equal(response.message, 'Transifex report: translation_completed, resource: receive operator in go spec project(ko)');
    assert.equal(response.icon, 'logo');
    assert.equal(response.errorLevel, 'normal');
  });

  it('should generate a review progression message', function() {
    var payload = examples['review_progression'];

    var settings = {
      events: {
        reviewed: true
      }
    };

    var response = parse(payload.headers, payload.body, settings);

    assert.equal(response.message, 'Transifex report: review is completed by 40 %, resource: receive operator in go spec project(ko)');
    assert.equal(response.icon, 'logo');
    assert.equal(response.errorLevel, 'normal');
  });
});

assert = require('assert');

suite('window and global test', function() {

  test('that global XMLHttpRequest is available', function() {
    // Only true if set explicitly
    //assert.strictEqual(window.global, global);

    // using global.XMLHttpRequest because that's what sinon looks for
    assert.strictEqual(window.XMLHttpRequest, global.XMLHttpRequest);
  });

});

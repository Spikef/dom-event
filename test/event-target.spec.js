var assert = require('assert');
var { Event } = require('../dist');

var DOMTree = require('./domTree.def');

describe('EventTarget Constructor', function () {
    var domTree = new DOMTree();
    var span = domTree.getElementById('li2_span1');

    it('should return li2_span1 when got id of span', function () {
        assert.equal(span.target.id, 'li2_span1');
    });

    it('should return li when got tagName of span', function () {
        assert.equal(span.target.tagName, 'span');
    });
});

describe('EventTarget.addEventListener', function () {
    var domTree = new DOMTree();
    var ul = domTree.getElementById('ul');
    var li = domTree.getElementById('li1');
    var span = domTree.getElementById('li1_span1');

    it('should return [ ul.capture:1, li.capture:1, span.target:2, li.propagation:3, ul.propagation:3 ]', function () {
        var flow = [];

        ul.addEventListener('dog', e => flow.push('ul.capture:' + e.eventPhase), true);
        li.addEventListener('dog', e => flow.push('li.capture:' + e.eventPhase), true);
        span.addEventListener('dog', e => flow.push('span.target:' + e.eventPhase), true);
        li.addEventListener('dog', e => flow.push('li.propagation:' + e.eventPhase));
        ul.addEventListener('dog', e => flow.push('ul.propagation:' + e.eventPhase));

        span.dispatchEvent(new Event('dog', { bubbles: true }));

        assert.deepStrictEqual(flow, [
            'ul.capture:1', 'li.capture:1', 'span.target:2', 'li.propagation:3', 'ul.propagation:3'
        ]);
    });
});

describe('EventTarget.removeEventListener', function () {
    var domTree = new DOMTree();
    var span = domTree.getElementById('li2_span1');

    var result = null;
    var callback = function(e) {
        result = e.detail;
    };

    span.addEventListener('wolf', callback);

    it('should return null when dispatch wolf', function () {
        span.removeEventListener('wolf', callback);
        span.dispatchEvent(new Event('wolf', { detail: 'wolf' }));
        assert.equal(result, null);
    });
});

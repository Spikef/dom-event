var assert = require('assert');
var { Event } = require('../dist');

var DOMTree = require('./domTree.def');

describe('Event Constructor', function () {
    var domTree = new DOMTree();
    var ul = domTree.getElementById('ul');
    var li = domTree.getElementById('li1');

    var event = new Event('monkey', {
        bubbles: true,
        detail: 'detail data',
    });

    it('should return monkey when got type', function () {
        assert.equal(event.type, 'monkey');
    });

    it('should return true when got bubbles', function () {
        assert.equal(event.bubbles, true);
        assert.equal(event.cancelBubble, false);
    });

    it('should return false when got cancelable', function () {
        assert.equal(event.cancelable, false);
        assert.equal(event.defaultPrevented, false);
    });

    it('should return [0, 100] when Date.now() - timeStamp', function () {
        var delta = Date.now() - event.timeStamp;
        assert.equal(delta > 0, true);
        assert.equal(delta < 100, true);
    });

    it('should return li1, ul when got target, currentTarget', function () {
        var target;
        var currentTarget;

        ul.addEventListener('monkey', e => { target = e.target.id; currentTarget = e.currentTarget.id; }, true);
        li.dispatchEvent(event);

        assert.equal(target, 'li1');
        assert.equal(currentTarget, 'ul');
    });
});

describe('Event.preventDefault', function () {
    var domTree = new DOMTree();
    var ul = domTree.getElementById('ul');

    var result;

    ul.bindDefault('bear', function (e) {
        result = 'bear';
    });

    it('should return bear when dispatch bear', function () {
        result = null;
        ul.dispatchEvent(new Event('bear', { cancelable: true }));

        assert.equal(result, 'bear');
    });

    it('should return null when preventDefault', function () {
        result = null;
        ul.addEventListener('bear', e => e.preventDefault());
        ul.dispatchEvent(new Event('bear', { cancelable: true }));

        assert.equal(result, null);
    });

    it('should return bear when preventDefault but cancelable=false', function () {
        result = null;
        ul.addEventListener('bear', e => e.preventDefault());
        ul.dispatchEvent(new Event('bear', { cancelable: false }));

        assert.equal(result, 'bear');
    });
});

describe('Event.stopPropagation', function () {
    var domTree = new DOMTree();
    var ul = domTree.getElementById('ul');
    var li = domTree.getElementById('li1');
    var span = domTree.getElementById('li1_span1');

    it('should return 3 when bubbles=false', function () {
        var times = 0;

        ul.addEventListener('cat', e => times++, true);
        li.addEventListener('cat', e => times++, true);
        span.addEventListener('cat', e => times++, true);
        li.addEventListener('cat', e => times++);
        ul.addEventListener('cat', e => times++);

        span.dispatchEvent(new Event('cat', { bubbles: false }));

        assert.deepStrictEqual(times, 3);
    });

    it('should return 3 when stopPropagation at li and propagation', function () {
        var times = 0;

        ul.addEventListener('pig', e => times++, true);
        li.addEventListener('pig', e => { times++; e.stopPropagation(); }, true);
        span.addEventListener('pig', e => times++, true);
        li.addEventListener('pig', e => times++);
        ul.addEventListener('pig', e => times++);

        span.dispatchEvent(new Event('pig', { bubbles: true }));

        assert.deepStrictEqual(times, 3);
    });

    it('should return 4 when stopPropagation at li and capture', function () {
        var times = 0;

        ul.addEventListener('duck', e => times++, true);
        li.addEventListener('duck', e => times++, true);
        span.addEventListener('duck', e => times++, true);
        li.addEventListener('duck', e => { times++; e.stopPropagation(); });
        ul.addEventListener('duck', e => times++);

        span.dispatchEvent(new Event('duck', { bubbles: true }));

        assert.deepStrictEqual(times, 4);
    });
});

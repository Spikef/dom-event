import Event from '../../src/lib/event';
import DOMTree from './domTree.def';

const domTree = new DOMTree();
const ul = domTree.getElementById('ul');
const li = domTree.getElementById('li1');

ul.addEventListener('funny', function (e) {
    console.log(1, e.target, e.currentTarget);
    setTimeout(() => {
        console.log(11, e.target, e.currentTarget);
    });
}, true);

li.addEventListener('funny', function (e) {
    console.log(2, e.target, e.currentTarget);
    setTimeout(() => {
        console.log(12, e.target, e.currentTarget);
    });
}, false);

ul.addEventListener('funny', function (e) {
    console.log(3, e.target, e.currentTarget);
    setTimeout(() => {
        console.log(13, e.target, e.currentTarget);
    });
}, false);

li.dispatchEvent(new Event('funny', { bubbles: true }));

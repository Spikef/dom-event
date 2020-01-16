const { EventTarget } = require('../dist');

const data = {
    id: 'ul',
    tag: 'ul',
    children: [
        {
            id: 'li1',
            tag: 'li',
            children: [
                {
                    id: 'li1_span1',
                    tag: 'span',
                    children: [],
                },
                {
                    id: 'li1_span2',
                    tag: 'span',
                    children: [],
                },
            ],
        },
        {
            id: 'li2',
            tag: 'li',
            children: [
                {
                    id: 'li2_span1',
                    tag: 'span',
                    children: [],
                },
                {
                    id: 'li2_span2',
                    tag: 'span',
                    children: [],
                },
            ],
        },
    ],
};

function Element(options) {
    this.id = options.id;
    this.tagName = options.tag;
}

function DOMTree() {
    const idMap = this.idMap = {};

    (function walk(node, parent) {
        const el = new EventTarget(parent);
        el.bindTarget(new Element({ id: node.id, tag: node.tag }));
        idMap[node.id] = el;

        if (node.children) {
            node.children.forEach(child => walk(child, el));
        }

        return node;
    })(data);
}

DOMTree.prototype.getElementById = function(id) {
    return this.idMap[id];
};

module.exports = DOMTree;

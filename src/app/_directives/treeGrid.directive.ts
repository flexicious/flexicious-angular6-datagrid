// **
// * Created by flexicious on 3/10/16.
// */
import {  Directive, ElementRef, Input, OnInit } from '@angular/core';

declare var flexiciousNmsp: any;

@Directive({
    selector: '[fd-grid]',
})
export class TreeGridDirective implements OnInit {

    @Input() model;

    constructor(public el: ElementRef) {
    }

    isXiName(str) {
        return str.startsWith('xi');
    }

    getNameFromXiName(str) {
        return str
            .toLowerCase()
            .replace('xi', '')
            .replace(/-\w/g, function (r) {
                return r.charAt(1).toUpperCase();
            });
    }

    getAllNodeAttributes(node) {
        const allAttrs = [];
        for (let i = 0; i < node.attributes.length; i++) {
            const key = node.attributes.item(i);
            if (this.isXiName(key.name)) {
                allAttrs.push(this.getNameFromXiName(key.name) + '="' + key.value + '"');
            }
        }
        return allAttrs.join(' ');
    }

    build(node, nodeName: String = '') {
        nodeName = nodeName || this.getNameFromXiName(node.nodeName);
        const root = '<' + nodeName + ' ' +
            this.getAllNodeAttributes(node) +
            ' >';
        let children = '';

        if (node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                children += this.build(node.children[i]);
            }
        }

        const close = '</' + nodeName + '>';
        return root + children + close;
    }

    ngOnInit() {
        this.model.configuration = this.build(this.el.nativeElement, 'grid');
        const grid = new flexiciousNmsp.FlexDataGrid(this.el.nativeElement, this.model);
        this.model.grid = grid;
    }
}


function randomize(min: number, max: number): number {
    return parseInt(String(min + Math.random() * (max - min)), 10);
}

import {RectOptInterface} from './interfaces';

export default class {
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
    color: string;

    constructor(args) {
        this.init(args);
    }

    init({top, left, width, height}: RectOptInterface): void {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.right = left + width;
        this.bottom = top + height;
        this.color = `rgb(${randomize(0, 255)},${randomize(0, 255)},${randomize(0, 255)})`;
    }

    moveTo({top, left}: { top: number, left: number }): void {
        this.init({top, left, width: this.width, height: this.height});
    }

    getDOMNode(): HTMLDivElement {
        const dom: HTMLDivElement = document.createElement('div');
        const pos: string = `
            top:${this.top}px;
            left:${this.left}px;
            width:${this.width}px;
            height:${this.height}px;
        `;
        const style: string = `
            position:absolute;
            background-color:${this.color};
            ${pos}
        `;
        dom.innerHTML = pos;
        dom.setAttribute('style', style);
        return dom;
    }
}
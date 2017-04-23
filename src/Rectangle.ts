import { randomize } from './utils';
import { RectOptInterface } from './interfaces';

export default class Rectangle {
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
    color: string;
    other: any

    constructor(args) {
        this.init(args);
    }

    init({ top = 0, left = 0, width, height, other }): void {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.right = left + width;
        this.bottom = top + height;
        this.color = `rgb(${randomize(0, 255)},${randomize(0, 255)},${randomize(0, 255)})`;
        this.other = other;
    }

    moveTo({ top, left }: { top: number, left: number }): void {
        this.init({ top, left, width: this.width, height: this.height, other: this.other });
    }

    getDOMNode(): HTMLDivElement {
        const dom: HTMLDivElement = document.createElement('div');
        const pos: string = `
            top:${this.top}px;
            left:${this.left}px;
            width:${this.width}px;
            height:${this.height}px;
            other:${this.other}
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

    serialize() {
        return {
            x: this.left,
            y: this.top,
            other: this.other,
        };
    }
}
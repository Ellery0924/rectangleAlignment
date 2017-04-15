import Rectangle from './Rectangle';
import {RectOptInterface} from './interfaces';

interface GapInterface {
    top: number;
    left: number;
    width: number;
    createBy: Rectangle
}

export default class {
    orderedList: Array<Rectangle>;
    notOrderedList: Array<Rectangle>;
    cw: number;
    canvas: HTMLScriptElement;
    gaps: Array<GapInterface>;

    constructor(rectList: Array<RectOptInterface>, cw: number, canvas: HTMLScriptElement) {
        this.orderedList = [];
        this.notOrderedList = rectList.map(ropt => new Rectangle(ropt));
        this.cw = cw;
        this.canvas = canvas;

        const gap: GapInterface = {
            top: 0,
            left: 0,
            width: cw,
            createBy: null
        };

        this.gaps = [gap];
    }

    fillGapInterface(rect: Rectangle, gap: GapInterface): void {
        rect.moveTo(gap);
        this.orderedList = this.orderedList.concat(rect).sort((a: Rectangle, b: Rectangle) => {
            if (a.left !== b.left) {
                return a.left - b.left;
            } else {
                return a.bottom - b.bottom;
            }
        });
        this.notOrderedList = this.notOrderedList.filter(r => r !== rect);

        // 首先调整rect填进去的这个gap
        // 如果gap收缩到宽度0，说明已经被填满了，可以移除掉这个gap
        // gap可能会变成一个有底的洞，但是这并不会影响之后的填充
        if (gap.width - rect.width === 0) {
            this.gaps = this.gaps.filter(g => g !== gap);
        } else { // 否则缩减gap的可用宽度，依然保留这个gap
            gap.width = gap.width - rect.width;
            gap.left = gap.left + rect.width;
        }

        const rBottom: number = rect.bottom;
        const rRight: number = rect.right;
        const rLeft: number = rect.left;
        // 生成一个新的gap，这个gap的top应该是这个rect移动以后的bottom，这个新gap的top和left很容易确定
        // 接下来计算它的宽度
        const newGapInterface: GapInterface = {top: rBottom, createBy: rect, left: null, width: null};

        // 从矩形的右下角往右查找，看能否撞到另一个矩形
        // 可以一直延伸到容器右边界
        // 左边界同理
        // 这样这个新的gap的尺寸就确定了
        const rectsOnTheRightSide: Array<Rectangle> = this.orderedList.filter(or => or.left >= rRight && or.bottom > rBottom);
        const rectsOnTheLeftSide: Array<Rectangle> = this.orderedList.filter(or => or.right <= rLeft && or.bottom > rBottom);

        let rectOnTheNearestRight;
        if (rectsOnTheRightSide.length) {
            rectOnTheNearestRight = rectsOnTheRightSide.sort((a, b) => a.left - b.left)[0];
        }

        let rectOnTheNearestLeft;
        if (rectsOnTheLeftSide.length) {
            rectOnTheNearestLeft = rectsOnTheLeftSide.sort((a, b) => b.left - a.left)[0];
        }

        newGapInterface.left = rectOnTheNearestLeft ? rectOnTheNearestLeft.right : 0;
        const newGapInterfaceRight: number = rectOnTheNearestRight ? rectOnTheNearestRight.left : this.cw;
        newGapInterface.width = newGapInterfaceRight - newGapInterface.left;

        this.gaps.push(newGapInterface);
        this.refreshGapInterfaces();
    }

    refreshGapInterfaces(): void {
        const ret: Array<GapInterface> = [];
        for (let i = 0; i < this.gaps.length; i++) {
            const gap: GapInterface = this.gaps[i];
            const barrierRect: Rectangle = this.orderedList.find(or =>
                or.bottom > gap.top && or.left >= gap.left
            );
            if (barrierRect) {
                const origGapInterfaceRight: number = gap.left + gap.width;
                const createBy: Rectangle = gap.createBy;
                if (createBy) {
                    if (createBy.left > barrierRect.left) {
                        ret.push({
                            top: gap.top,
                            left: barrierRect.right,
                            width: origGapInterfaceRight - barrierRect.right,
                            createBy: createBy
                        });
                    } else {
                        ret.push({
                            top: gap.top,
                            left: gap.left,
                            width: barrierRect.left - gap.left,
                            createBy: createBy
                        });
                    }
                }
            } else {
                ret.push(gap);
            }
        }

        this.gaps = ret.sort((a, b) => a.top - b.top);
    }

    findMostMatchedRect(gap: GapInterface): Rectangle {
        const gw: number = gap.width;
        let sub: number = gw;
        let mostMatched: Rectangle = null;

        for (let i = 0; i < this.notOrderedList.length; i++) {
            const notOrderedRect: Rectangle = this.notOrderedList[i];
            const rectWidth: number = notOrderedRect.width;
            if (gw >= rectWidth && sub > gw - rectWidth) {
                sub = gw - rectWidth;
                mostMatched = notOrderedRect;
            }
        }

        return mostMatched;
    }

    drawOrderedRect(): void {
        this.orderedList
            .sort((a, b) => a.bottom - b.bottom)
            .forEach(or => {
                const rectDOM = or.getDOMNode();
                this.canvas.appendChild(rectDOM);
            });
    }

    drawGapInterfaces(): void {
        const existsGapInterfaceDOMS: NodeListOf<Element> = document.querySelectorAll('.gap');

        for (let i = 0; i < existsGapInterfaceDOMS.length; i++) {
            const dom: Element = existsGapInterfaceDOMS[i];
            dom.parentNode.removeChild(dom);
        }

        this.gaps.forEach(gap => {
            const gapDOM: HTMLDivElement = document.createElement('div');
            gapDOM.className = 'gap';
            const style = `
                height:1px;
                position:absolute;
                background:red;
                top:${gap.top}px;
                left:${gap.left}px;
                width:${gap.width}px
            `;
            gapDOM.setAttribute('style', style);
            this.canvas.appendChild(gapDOM);
        });
    }

    align(): IterableIterator<any> {
        let step = function*() {
            let counter = 10;
            while (this.notOrderedList.length > 0 && counter > 0) {
                // gaps按bottom升序排列
                for (let i = 0; i < this.gaps.length; i++) {
                    const gap = this.gaps[i];
                    const mostMatchedRect = this.findMostMatchedRect(gap);
                    if (mostMatchedRect) {
                        this.fillGapInterface(mostMatchedRect, gap);
                        this.drawOrderedRect();
                        yield this.drawGapInterfaces();
                        break;
                    }
                }
            }
        };

        return step.bind(this)();
    }
}
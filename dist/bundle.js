/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function randomize(min, max) {
    return parseInt(String(min + Math.random() * (max - min)), 10);
}
exports.randomize = randomize;
function getRandomRects() {
    return new Array(10).fill(1).map(() => ({
        top: 0,
        left: 0,
        width: randomize(300, 400),
        height: randomize(300, 400)
    }));
}
exports.getRandomRects = getRandomRects;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = __webpack_require__(2);
class default_1 {
    constructor(rectList, cw, canvas) {
        this.orderedList = [];
        this.notOrderedList = rectList.map(ropt => new Rectangle_1.default(ropt));
        this.cw = cw;
        this.canvas = canvas;
        const gap = {
            top: 0,
            left: 0,
            width: cw,
            createBy: null
        };
        this.gaps = [gap];
    }
    fillGap(rect, gap) {
        rect.moveTo(gap);
        this.orderedList = this.orderedList.concat(rect).sort((a, b) => {
            if (a.left !== b.left) {
                return a.left - b.left;
            }
            else {
                return a.bottom - b.bottom;
            }
        });
        this.notOrderedList = this.notOrderedList.filter(r => r !== rect);
        // 首先调整rect填进去的这个gap
        // 如果gap收缩到宽度0，说明已经被填满了，可以移除掉这个gap
        // gap可能会变成一个有底的洞，但是这并不会影响之后的填充
        if (gap.width - rect.width === 0) {
            this.gaps = this.gaps.filter(g => g !== gap);
        }
        else {
            gap.width = gap.width - rect.width;
            gap.left = gap.left + rect.width;
        }
        const rBottom = rect.bottom;
        const rRight = rect.right;
        const rLeft = rect.left;
        // 生成一个新的gap，这个gap的top应该是这个rect移动以后的bottom，这个新gap的top和left很容易确定
        // 接下来计算它的宽度
        const newGap = { top: rBottom, createBy: rect, left: null, width: null };
        // 从矩形的右下角往右查找，看能否撞到另一个矩形
        // 可以一直延伸到容器右边界
        // 左边界同理
        // 这样这个新的gap的尺寸就确定了
        const rectsOnTheRightSide = this.orderedList.filter(or => or.left >= rRight && or.bottom > rBottom);
        const rectsOnTheLeftSide = this.orderedList.filter(or => or.right <= rLeft && or.bottom > rBottom);
        let rectOnTheNearestRight;
        if (rectsOnTheRightSide.length) {
            rectOnTheNearestRight = rectsOnTheRightSide.sort((a, b) => a.left - b.left)[0];
        }
        let rectOnTheNearestLeft;
        if (rectsOnTheLeftSide.length) {
            rectOnTheNearestLeft = rectsOnTheLeftSide.sort((a, b) => b.left - a.left)[0];
        }
        newGap.left = rectOnTheNearestLeft ? rectOnTheNearestLeft.right : 0;
        const newGapRight = rectOnTheNearestRight ? rectOnTheNearestRight.left : this.cw;
        newGap.width = newGapRight - newGap.left;
        this.gaps.push(newGap);
        this.refreshGap();
    }
    refreshGap() {
        const ret = [];
        for (let i = 0; i < this.gaps.length; i++) {
            const gap = this.gaps[i];
            const barrierRect = this.orderedList.find(or => or.bottom > gap.top && or.left >= gap.left);
            if (barrierRect) {
                const origGapRight = gap.left + gap.width;
                const createBy = gap.createBy;
                if (createBy) {
                    if (createBy.left > barrierRect.left) {
                        ret.push({
                            top: gap.top,
                            left: barrierRect.right,
                            width: origGapRight - barrierRect.right,
                            createBy: createBy
                        });
                    }
                    else {
                        ret.push({
                            top: gap.top,
                            left: gap.left,
                            width: barrierRect.left - gap.left,
                            createBy: createBy
                        });
                    }
                }
            }
            else {
                ret.push(gap);
            }
        }
        this.gaps = ret.sort((a, b) => a.top - b.top);
    }
    findMostMatchedRect(gap) {
        const gw = gap.width;
        let sub = gw;
        let mostMatched = null;
        for (let i = 0; i < this.notOrderedList.length; i++) {
            const notOrderedRect = this.notOrderedList[i];
            const rectWidth = notOrderedRect.width;
            if (gw >= rectWidth && sub > gw - rectWidth) {
                sub = gw - rectWidth;
                mostMatched = notOrderedRect;
            }
        }
        return mostMatched;
    }
    drawOrderedRect() {
        this.orderedList
            .sort((a, b) => a.bottom - b.bottom)
            .forEach(or => {
            const rectDOM = or.getDOMNode();
            this.canvas.appendChild(rectDOM);
        });
    }
    drawGap() {
        const existsGapDOMs = document.querySelectorAll('.gap');
        for (let i = 0; i < existsGapDOMs.length; i++) {
            const dom = existsGapDOMs[i];
            dom.parentNode.removeChild(dom);
        }
        this.gaps.forEach(gap => {
            const gapDOM = document.createElement('div');
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
    align() {
        let step = function* () {
            while (this.notOrderedList.length > 0) {
                // gaps按bottom升序排列
                for (let i = 0; i < this.gaps.length; i++) {
                    const gap = this.gaps[i];
                    const mostMatchedRect = this.findMostMatchedRect(gap);
                    if (mostMatchedRect) {
                        this.fillGap(mostMatchedRect, gap);
                        this.drawOrderedRect();
                        yield this.drawGap();
                        break;
                    }
                }
            }
        };
        return step.bind(this)();
    }
}
exports.default = default_1;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __webpack_require__(0);
class default_1 {
    constructor(args) {
        this.init(args);
    }
    init({ top, left, width, height }) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.right = left + width;
        this.bottom = top + height;
        this.color = `rgb(${utils_1.randomize(0, 255)},${utils_1.randomize(0, 255)},${utils_1.randomize(0, 255)})`;
    }
    moveTo({ top, left }) {
        this.init({ top, left, width: this.width, height: this.height });
    }
    getDOMNode() {
        const dom = document.createElement('div');
        const pos = `
            top:${this.top}px;
            left:${this.left}px;
            width:${this.width}px;
            height:${this.height}px;
        `;
        const style = `
            position:absolute;
            background-color:${this.color};
            ${pos}
        `;
        dom.innerHTML = pos;
        dom.setAttribute('style', style);
        return dom;
    }
}
exports.default = default_1;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Matrix_1 = __webpack_require__(1);
const utils_1 = __webpack_require__(0);
function init() {
    const canvas = document.querySelector('#canvas');
    canvas.innerHTML = '';
    const data = utils_1.getRandomRects();
    const m = new Matrix_1.default(data, 1200, canvas);
    return m.align();
}
let ctrl = init();
document.querySelector('#next').addEventListener('click', () => {
    ctrl.next();
});
document.querySelector('#refresh').addEventListener('click', () => {
    ctrl = init();
});


/***/ })
/******/ ]);
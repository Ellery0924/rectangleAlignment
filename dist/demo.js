(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
    return new Array(5).fill(1).map(function (_, i) { return ({
        width: i < 2 ? 1200 : randomize(300, 400),
        height: randomize(300, 400),
        other: i,
        placeAtBottom: i < 2
    }); });
}
exports.getRandomRects = getRandomRects;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Rectangle_1 = __webpack_require__(2);
var Alignment = (function () {
    function Alignment(rectList, cw, canvas) {
        this.orderedList = [];
        this.notOrderedList = rectList.filter(function (ropt) { return !ropt.placeAtBottom; }).map(function (ropt) { return new Rectangle_1.default(ropt); });
        this.bottomEleList = rectList.filter(function (ropt) { return ropt.placeAtBottom; }).map(function (ropt) { return new Rectangle_1.default(ropt); });
        this.cw = cw;
        this.canvas = canvas;
        if (rectList.some(function (rect) { return rect.width > cw; })) {
            throw new Error('存在大于容器宽度的矩形，请检查.');
        }
        var gap = {
            top: 0,
            left: 0,
            width: cw,
            createBy: null
        };
        this.gaps = [gap];
    }
    Alignment.prototype.fillGap = function (rect, gap) {
        rect.moveTo(gap);
        this.orderedList = this.orderedList.concat(rect).sort(function (a, b) {
            if (a.left !== b.left) {
                return a.left - b.left;
            }
            else {
                return a.bottom - b.bottom;
            }
        });
        this.notOrderedList = this.notOrderedList.filter(function (r) { return r !== rect; });
        // 首先调整rect填进去的这个gap
        // 如果gap收缩到宽度0，说明已经被填满了，可以移除掉这个gap
        // gap可能会变成一个有底的洞，但是这并不会影响之后的填充
        if (gap.width - rect.width === 0) {
            this.gaps = this.gaps.filter(function (g) { return g !== gap; });
        }
        else {
            gap.width = gap.width - rect.width;
            gap.left = gap.left + rect.width;
        }
        var rBottom = rect.bottom;
        var rRight = rect.right;
        var rLeft = rect.left;
        // 生成一个新的gap，这个gap的top应该是这个rect移动以后的bottom，这个新gap的top和left很容易确定
        // 接下来计算它的宽度
        var newGap = { top: rBottom, createBy: rect, left: null, width: null };
        // 从矩形的右下角往右查找，看能否撞到另一个矩形
        // 可以一直延伸到容器右边界
        // 左边界同理
        // 这样这个新的gap的尺寸就确定了
        var rectsOnTheRightSide = this.orderedList.filter(function (or) { return or.left >= rRight && or.bottom > rBottom; });
        var rectsOnTheLeftSide = this.orderedList.filter(function (or) { return or.right <= rLeft && or.bottom > rBottom; });
        var rectOnTheNearestRight;
        if (rectsOnTheRightSide.length) {
            rectOnTheNearestRight = rectsOnTheRightSide.sort(function (a, b) { return a.left - b.left; })[0];
        }
        var rectOnTheNearestLeft;
        if (rectsOnTheLeftSide.length) {
            rectOnTheNearestLeft = rectsOnTheLeftSide.sort(function (a, b) { return b.left - a.left; })[0];
        }
        newGap.left = rectOnTheNearestLeft ? rectOnTheNearestLeft.right : 0;
        var newGapRight = rectOnTheNearestRight ? rectOnTheNearestRight.left : this.cw;
        newGap.width = newGapRight - newGap.left;
        this.gaps.push(newGap);
        this.refreshGap();
    };
    Alignment.prototype.refreshGap = function () {
        var ret = [];
        var _loop_1 = function (i) {
            var gap = this_1.gaps[i];
            var barrierRect = this_1.orderedList.find(function (or) {
                return or.bottom > gap.top && or.left >= gap.left;
            });
            if (barrierRect) {
                var origGapRight = gap.left + gap.width;
                var createBy = gap.createBy;
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
        };
        var this_1 = this;
        for (var i = 0; i < this.gaps.length; i++) {
            _loop_1(i);
        }
        this.gaps = ret.sort(function (a, b) { return a.top - b.top; });
    };
    Alignment.prototype.findMostMatchedRect = function (gap) {
        var gw = gap.width;
        var sub = gw;
        var mostMatched = null;
        for (var i = 0; i < this.notOrderedList.length; i++) {
            var notOrderedRect = this.notOrderedList[i];
            var rectWidth = notOrderedRect.width;
            if (gw >= rectWidth && sub > gw - rectWidth) {
                sub = gw - rectWidth;
                mostMatched = notOrderedRect;
            }
        }
        return mostMatched;
    };
    Alignment.prototype.align = function () {
        var _this = this;
        while (this.notOrderedList.length > 0) {
            // gaps按bottom升序排列
            for (var i = 0; i < this.gaps.length; i++) {
                var gap = this.gaps[i];
                var mostMatchedRect = this.findMostMatchedRect(gap);
                if (mostMatchedRect) {
                    this.fillGap(mostMatchedRect, gap);
                    break;
                }
            }
        }
        var maxY = this.orderedList.length ? Math.max.apply(undefined, this.orderedList.map(function (item) { return item.bottom; })) : 0;
        if (this.bottomEleList) {
            this.bottomEleList.forEach(function (ele) {
                ele.moveTo({ top: maxY, left: 0 });
                _this.orderedList.push(ele);
                maxY += ele.height;
            });
        }
    };
    Alignment.prototype.getOrderedList = function () {
        return this.orderedList.map(function (rectangle) { return rectangle.serialize(); });
    };
    return Alignment;
}());
exports.default = Alignment;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(0);
var Rectangle = (function () {
    function Rectangle(args) {
        this.init(args);
    }
    Rectangle.prototype.init = function (_a) {
        var _b = _a.top, top = _b === void 0 ? 0 : _b, _c = _a.left, left = _c === void 0 ? 0 : _c, width = _a.width, height = _a.height, other = _a.other;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.right = left + width;
        this.bottom = top + height;
        this.color = "rgb(" + utils_1.randomize(0, 255) + "," + utils_1.randomize(0, 255) + "," + utils_1.randomize(0, 255) + ")";
        this.other = other;
    };
    Rectangle.prototype.moveTo = function (_a) {
        var top = _a.top, left = _a.left;
        this.init({ top: top, left: left, width: this.width, height: this.height, other: this.other });
    };
    Rectangle.prototype.serialize = function () {
        return {
            x: this.left,
            y: this.top,
            other: this.other,
        };
    };
    return Rectangle;
}());
exports.default = Rectangle;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Alignment_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(0);
function init() {
    var canvas = document.querySelector('#canvas');
    canvas.innerHTML = '';
    var data = utils_1.getRandomRects();
    console.log(data);
    var m = new Alignment_1.default(data, 1200, canvas);
    m.align();
    console.log(m.getOrderedList());
}
var ctrl = init();
document.querySelector('#refresh').addEventListener('click', function () {
    ctrl = init();
});


/***/ })
/******/ ]);
});
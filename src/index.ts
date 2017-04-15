import Matrix from './Matrix';

function randomize(min, max) {
    return min + Math.random() * (max - min);
}

function getRandomRects() {
    return new Array(10).fill(1).map(() => ({
        top: 0,
        left: 0,
        width: randomize(200, 400),
        height: randomize(200, 400)
    }));
}

function init(): any {
    const canvas = <HTMLScriptElement>document.querySelector('#canvas');
    canvas.innerHTML = '';
    const data = getRandomRects();
    const m = new Matrix(data, 1000, canvas);
    return m.align();
}

let ctrl = init();

document.querySelector('#next').addEventListener('click', () => {
    ctrl.next();
});

document.querySelector('#refresh').addEventListener('click', () => {
    ctrl = init();
});
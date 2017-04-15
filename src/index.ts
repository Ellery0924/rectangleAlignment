import Matrix from './Matrix';
import { randomize, getRandomRects } from './utils';

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
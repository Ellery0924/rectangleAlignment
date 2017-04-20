import Alignment from '../src/Alignment';
import { randomize, getRandomRects } from '../src/utils';

function init(): any {
    const canvas = <HTMLScriptElement>document.querySelector('#canvas');
    canvas.innerHTML = '';
    const data = getRandomRects();
    const m = new Alignment(data, 1200, canvas);
    return m.align(true);
}

let ctrl = init();

document.querySelector('#next').addEventListener('click', () => {
    ctrl.next();
});

document.querySelector('#refresh').addEventListener('click', () => {
    ctrl = init();
});
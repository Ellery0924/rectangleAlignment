import { RectOptInterface } from './interfaces';

export function randomize(min: number, max: number): number {
    return parseInt(String(min + Math.random() * (max - min)), 10);
}

export function getRandomRects(): Array<RectOptInterface> {
    return new Array(10).fill(1).map(() => ({
        top: 0,
        left: 0,
        width: randomize(200, 400),
        height: randomize(200, 400)
    }));
}
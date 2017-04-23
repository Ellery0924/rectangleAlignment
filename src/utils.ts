export function randomize(min: number, max: number): number {
    return parseInt(String(min + Math.random() * (max - min)), 10);
}

export function getRandomRects(): Array<{ width: number, height: number, other: number }> {
    return new Array(10).fill(1).map((_, i) => ({
        width: randomize(300, 400),
        height: randomize(300, 400),
        other: i
    }));
}
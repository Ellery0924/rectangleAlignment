export function randomize(min: number, max: number): number {
    return parseInt(String(min + Math.random() * (max - min)), 10);
}

export function getRandomRects() {
    return new Array(1).fill(1).map((_, i) => ({
        width: i === 1 ? 1200 : randomize(300, 400),
        height: randomize(300, 400),
        other: i,
        placeAtBottom: i === 1
    }));
}
interface Area {
    xFrom: number,
    xTo: number,
    yFrom: number,
    yTo: number
};

export default class ImageConfiguration {
    public readonly filename: string;
    public readonly cutoutArea: Area;

    constructor(filename: string, cutoutArea: Area) {
        this.filename = filename;
        this.cutoutArea = cutoutArea;
    }

    public getWidth(): number {
        return this.cutoutArea.xTo - this.cutoutArea.xFrom;
    }

    public getHeight(): number {
        return this.cutoutArea.yTo - this.cutoutArea.yFrom;
    }
};
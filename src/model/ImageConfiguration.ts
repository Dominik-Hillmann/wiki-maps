interface ImageConfigParams {
    filename: string;
    cutoutArea: {
        xFrom: number,
        xTo: number,
        yFrom: number,
        yTo: number
    };
};

export default class ImageConfiguration {
    public readonly filename: string;
    public readonly cutoutArea: {
        xFrom: number,
        xTo: number,
        yFrom: number,
        yTo: number
    };

    /**
     * 
     * @throws {TypeError} A "From" value is larger than a "To" value or 
     * contains NaNs.
     */
    constructor({ filename, cutoutArea }: ImageConfigParams) {
        this.filename = filename;
        this.cutoutArea = cutoutArea;

        const xFromIsLarger: boolean = this.cutoutArea.xFrom > this.cutoutArea.xTo;
        const yFromIsLarger: boolean = this.cutoutArea.yFrom > this.cutoutArea.yTo;
        if (xFromIsLarger || yFromIsLarger) {
            throw new TypeError(`"From" values cannot be larger than "To" values.`);
        }

        const anyNumIsNaN: boolean = (() => {
            return isNaN(cutoutArea.xFrom) ||
                isNaN(cutoutArea.xTo) ||
                isNaN(cutoutArea.yFrom) ||
                isNaN(cutoutArea.yTo);
        })();
        if (anyNumIsNaN) {
            throw new TypeError('Cutout area contains NaNs.');
        }
    }

    public getWidth(): number {
        return this.cutoutArea.xTo - this.cutoutArea.xFrom;
    }

    public getHeight(): number {
        return this.cutoutArea.yTo - this.cutoutArea.yFrom;
    }
};
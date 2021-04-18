// Libraries
import { Image } from 'canvas';
// Other components
import PossibleLanguages from '../model/PossibleLanguages';
import PossibleStyles from '../model/PossibleStyles';

/**
 * Describes possible parameters of image creation.
 */
export default interface RequestParameters {
    /** The word described in the image. */
    readonly term: string;
    /** The language in which the image text will be written. */
    readonly lang: PossibleLanguages;
    /** The text descibing the main term. */
    readonly text: string;
    /** If wanted, one of the images that are available by default. */
    readonly preMadeBackground?: string;
    /** The user's own image, if wanted. */
    readonly customBackground?: Image;
    /** Settings about the styling og the image. */
    readonly style: {
        overallStyle: PossibleStyles,
        color: string,
        frameWidth: number,
        writingBorder: 'stroked' | 'shadowed'
    };
};
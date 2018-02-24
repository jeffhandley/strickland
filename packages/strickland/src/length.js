import every from './every';
import minLength from './minLength';
import maxLength from './maxLength';

export default function length(minLengthParam, maxLengthParam) {
    return every([
        minLength(minLengthParam),
        maxLength(maxLengthParam)
    ]);
}

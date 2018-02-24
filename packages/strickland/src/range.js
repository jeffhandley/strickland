import every from './every';
import min from './min';
import max from './max';

export default function range(minValue, maxValue) {
    return every([
        min(minValue),
        max(maxValue)
    ]);
}

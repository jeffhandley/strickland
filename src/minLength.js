import minFieldValue from './minFieldValue';

export default function minLengthValidator(min = 0, props) {
    props = Object.assign({}, props);
    props.message = props.message || `Length of at least ${min}`;

    return minFieldValue('length', min, props);
}

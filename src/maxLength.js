import maxFieldValue from './maxFieldValue';

export default function maxLengthValidator(max = 0, props) {
    props = props || {};
    props.message = props.message || `Length no more than ${max}`;

    return maxFieldValue('length', max, props);
}

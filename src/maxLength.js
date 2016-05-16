import maxFieldValue from './maxFieldValue';

export default function maxLengthValidator(max = 0, props) {

    props = Object.assign(
        {
            validator: maxLengthValidator,
            message: `Length no more than ${max}`
        },
        props
    );

    return maxFieldValue('length', max, props);
}

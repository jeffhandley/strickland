import minFieldValue from './minFieldValue';

export default function minLengthValidator(min = 0, props) {
    props = Object.assign(
        {
            validator: minLengthValidator,
            message: `Length of at least ${min}`
        },
        props
    );

    return minFieldValue('length', min, props);
}

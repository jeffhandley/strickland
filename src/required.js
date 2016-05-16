import validator from './validator';

export default function requiredValidator(props) {
    props = Object.assign({}, props);
    props.message = props.message || 'Required';

    // The required validator doesn't ignore any values by default
    props.isIgnored = props.isIgnored || (() => false);

    return validator(
        (value) => !!value,
        props
    );
}

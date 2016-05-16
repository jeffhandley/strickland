import validator from './validator';

export default function requiredValidator(props) {
    props = Object.assign({}, props);
    props.message = props.message || 'Required';

    // The required validator doesn't ignore any values
    props.isIgnored = () => false;

    return validator(
        (value) => !!value,
        props
    );
}

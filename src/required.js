let notDefined;

export default function required(props) {
    props = props || {};

    return function validate(value) {
        let isValid = true;

        if (value === null || value === notDefined) {
            isValid = false;
        } else if (typeof value === 'string') {
            if (props.trim !== false) {
                if (typeof props.trim === 'function') {
                    value = props.trim(value);
                } else {
                    value = value.trim();
                }
            }

            isValid = !!value.length;
        } else if (typeof value === 'boolean') {
            // By supporting required on boolean values where false is invalid
            // we open up scenarios for required checkboxes
            isValid = value;
        }

        return {
            ...props,
            isValid
        };
    }
}

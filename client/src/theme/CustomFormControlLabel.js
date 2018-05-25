import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { FormControlLabel} from '@material-ui/core';

const styles = theme => ({
    label: {
        color: "whitesmoke"
    }
});

const CustomFormControlLabel = (props) => {
    const {control,
        classes,
        label
        } = props;
    
    return (
        <FormControlLabel
            control={control}
            classes={{
                label: classes.label
            }}
            label={label}
        />
    )
    
}

export default withStyles(styles, { withTheme: true })(FormControlLabel);
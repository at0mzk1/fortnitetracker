import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import ChipInput from 'material-ui-chip-input'

const styles = {
    label: {
        color: "whitesmoke",
        fontWeight: 300,
        fontSize: "2.5rem",
        display: "contents"
    },
    input: {
        color: "whitesmoke",
        textAlign: 'right',
        border: "3 px solid whitesmoke"
    },
    helperText: {
        color: "whitesmoke"
    }
}

const CustomChipInput = (props) => {
    const { 
        classes,
        value,
        label,
        onAdd,
        onDelete,
        id,
        helperText,
        placeholder
    } = props;

    return (
        <ChipInput
            value={value}
            onAdd={(chip) => onAdd(chip)}
            onDelete={(deletedChip) => onDelete(deletedChip)}
            onBlur={(event) => {
                if (this.props.addOnBlur && event.target.value) {
                    onAdd(event.target.value)
                }
            }}
            fullWidth
            label={label}
            id={id}
            helperText={helperText}
            placeholder={placeholder}
            classes={{
                root: classes.inputRoot,
                input: classes.input,
                label: classes.label,
                helperText: classes.helperText
            }}
        />
    )

}

export default withStyles(styles, { withTheme: true })(ChipInput);
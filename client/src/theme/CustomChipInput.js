import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import ChipInput from 'material-ui-chip-input'

const styles = {
    root: {
        paddingTop: 30,
        paddingBottom: 30
    },
    label: {
        color: "whitesmoke",
        fontWeight: 300,
        fontSize: "1.5em",
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
// eslint-disable-next-line
const CustomChipInput = (props) => {
    const { 
        classes,
        value,
        label,
        onAdd,
        onDelete,
        id,
        helperText,
        placeholder,
        chipRenderer
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
            chipRenderer={chipRenderer}
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
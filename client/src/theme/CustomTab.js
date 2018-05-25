import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
    root: {
        [theme.breakpoints.up('md')]: {
            minWidth: 0,
        },
    },
    textColorPrimary: {
        color: "whitesmoke"
    },
    textColorSecondary: {
        color: "whitesmoke"
    }
});

const CustomTab = (props) => {
    const { key,
        classes,
        value,
        label 
        } = props;
    
    return (
    <Tab 
    classes={{
        root: classes.root,
        textColorPrimary: classes.textColorPrimary,
        textColorSecondary: classes.textColorSecondary
    }}
    key={key} 
    value={value}
    label={label}
    fullWidth />
    )
    
}

export default withStyles(styles, { withTheme: true })(Tab);
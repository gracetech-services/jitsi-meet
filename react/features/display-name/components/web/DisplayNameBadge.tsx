import React from 'react';
import { makeStyles } from 'tss-react/mui';

import { DISPLAY_NAME_VERTICAL_PADDING } from './styles';

const useStyles = makeStyles()(theme => {
    const { fishMeetMainColor02, fishMeetText } = theme.palette;

    return {
        badge: {
            background: fishMeetMainColor02,
            borderRadius: 22,
            color: fishMeetText,
            maxWidth: '50%',
            overflow: 'hidden',
            padding: `${DISPLAY_NAME_VERTICAL_PADDING / 2}px 16px`,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    };
});

/**
 * Component that displays a name badge.
 *
 * @param {Props} props - The props of the component.
 * @returns {ReactElement}
 */
const DisplayNameBadge: React.FC<{ name: string; }> = ({ name }) => {
    const { classes } = useStyles();

    return (
        <div className = { classes.badge }>
            { name }
        </div>
    );
};

export default DisplayNameBadge;

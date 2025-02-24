import React from 'react';
import { View, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';

import { appType } from '../../../base/config/AppType';
import { shouldShowResults } from '../../functions';

import PollAnswer from './PollAnswer';
import PollResults from './PollResults';
import { fishMeetChatStyles } from './fishMeetStyles';
import { chatStyles } from './styles';

interface IProps {

    /**
     * Id of the poll.
     */
    pollId: string;

}

const PollItem = ({ pollId }: IProps) => {
    const showResults = useSelector(shouldShowResults(pollId));

    return (
        <View
            style = { (appType.isFishMeet
                ? fishMeetChatStyles.fishMeetPollItemContainer
                : chatStyles.pollItemContainer) as ViewStyle }>
            {showResults
                ? <PollResults
                    key = { pollId }
                    pollId = { pollId } />
                : <PollAnswer
                    pollId = { pollId } />
            }

        </View>
    );
};

export default PollItem;

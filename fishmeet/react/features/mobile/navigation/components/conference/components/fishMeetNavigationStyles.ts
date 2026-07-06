import BaseTheme from '../../../../../base/ui/components/BaseTheme.native';

export const styleHeader = {
    viewStyle: {
        backgroundColor: BaseTheme.palette.customizedUiBackground,
        height: 60,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    textStyle: {
        color: BaseTheme.palette.text01,
        fontSize: 18,
        flex: 1,
        textAlign: 'center' as const
    },
};


import * as React from 'react';
import { ViewStyle, TextStyle } from 'react-native';

export type GesPasswordStates = 'normal' | 'right' | 'wrong'

export interface GesturePasswordProps {
    style?: ViewStyle,
    transparentLine?: boolean,
    textStyle?: TextStyle,
    message?: string,
    normalColor?: string,
    rightColor?: string,
    wrongColor?: string,
    status?: GesPasswordStates,
    interval?: number,
    allowCross?: boolean,
    innerCircle?: boolean,
    outerCircle?: boolean
    onStart?: () => void,
    onEnd?: (password: string) => void,
    onReset?: () => void
}

declare class GesturePassword extends React.Component<GesturePasswordProps> { }
export default GesturePassword;

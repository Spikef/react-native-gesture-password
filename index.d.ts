import * as React from 'react';

export type GesPasswordStates = 'normal' | 'right' | 'wrong'

export interface GesturePasswordProps {
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

declare class GesturePassword extends React.Component<GesturePasswordProps> {}
export default GesturePassword;

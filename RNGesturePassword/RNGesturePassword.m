//
//  RNGesturePassword.m
//  RNGesturePassword
//
//  Created by Spikef on 15/8/30.
//  Copyright © 2015年 Spikef. All rights reserved.
//

#import "RNGesturePassword.h"
#import "BoardView.h"

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"

@implementation RNGesturePassword

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(inputDefault, NSString);
RCT_EXPORT_VIEW_PROPERTY(inputTipText, NSString);
RCT_EXPORT_VIEW_PROPERTY(gestureError, BOOL);

- (NSArray *)customDirectEventTypes
{
    return @[
        @"onStart",
        @"onEnd",
        @"onCancel"
    ];
}

- (UIView *)view
{    
    BoardView* board = [[BoardView alloc] init];
    board.bridge = self.bridge;
    return board;
}

@end
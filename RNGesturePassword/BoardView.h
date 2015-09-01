//
//  BoardView.h
//  RNGesturePassword
//
//  Created by Spikef on 15/8/30.
//  Copyright © 2015年 Spikef. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "GesturePasswordView.h"

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface BoardView : UIView

@property (nonatomic, assign) RCTBridge* bridge;

@property (nonatomic, assign) NSString* inputDefault;
@property (nonatomic, assign) NSString* inputTipText;
@property (nonatomic, assign) BOOL*     gestureError;

@end

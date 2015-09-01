//
//  BoardView.m
//  RNGesturePassword
//
//  Created by Spikef on 15/8/30.
//  Copyright © 2015年 Spikef. All rights reserved.
//

#import "BoardView.h"
#import "GesturePasswordView.h"

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"

static inline UIColor*
UIColorRGB(float r, float g, float b)
{
    return [UIColor colorWithRed:r/255.0 green:g/255.0 blue:b/255.0 alpha:1.0];
}

@interface BoardView () <GesturePasswordViewDelegate>

@property (nonatomic,strong) GesturePasswordView* gesturePasswordView;

@end

@implementation BoardView
{
    UIView* backView_;
    UILabel* messageLabel_;
}

@synthesize bridge, inputDefault, inputTipText, gestureError;


- (instancetype) init;
{
    int Width = [UIScreen mainScreen].bounds.size.width;
    int Height = [UIScreen mainScreen].bounds.size.height;
    
    if (self = [super init]) {
        self.backgroundColor = UIColorRGB(41, 43, 56);
        
        backView_ = [[UIView alloc] initWithFrame: CGRectMake(0, 0, Width, Height)];
        backView_.backgroundColor = UIColorRGB(41, 43, 56);
        backView_.opaque = NO;
        [self addSubview:backView_];
        
        float top = (Height - Width)/2.0 * 1.5;
        
        _gesturePasswordView                  = [[GesturePasswordView alloc] initWithFrame:CGRectMake(0, top, Width, Width)];
        _gesturePasswordView.backgroundColor = self.backgroundColor;
        _gesturePasswordView.delegate        = self;
        [self addSubview:_gesturePasswordView];
        
        messageLabel_               = [[UILabel alloc] initWithFrame:CGRectMake(0, top/2.2, Width, top/3.0)];
        messageLabel_.numberOfLines = 0;
        messageLabel_.textAlignment = NSTextAlignmentCenter;
        messageLabel_.font          = [UIFont systemFontOfSize:16];
        messageLabel_.textColor     = [_gesturePasswordView selectedColor];
        messageLabel_.text          = inputDefault;
        
        [self addSubview:messageLabel_];
    }
    
    return self;
}

-(id)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
    if (point.y < self.gesturePasswordView.frame.origin.y) {
        return nil;
    } else {
        return self.gesturePasswordView;
    }
}

- (void) gesturePasswordView:(GesturePasswordView *)passwordView didEndInputWithPassword:(NSString *)password sequence:(NSUInteger)sequence
{
    [self.bridge.eventDispatcher
        sendInputEventWithName:@"end"
        body:@{
               @"target": self.reactTag,
               @"password": password
            }
     ];
}

- (void) gesturePasswordView:(GesturePasswordView *)passwordView didStartedWithSequence:(NSUInteger)sequence
{
    [self.bridge.eventDispatcher
     sendInputEventWithName:@"start"
     body:@{
            @"target": self.reactTag
        }
     ];
}

- (void) gesturePasswordView:(GesturePasswordView *)passwordView didCanceledWithSequence:(NSUInteger)sequence
{
    [self.bridge.eventDispatcher
     sendInputEventWithName:@"cancel"
     body:@{
            @"target": self.reactTag
        }
     ];
}

// set properties
- (void) setInputDefault:(NSString *)tipText
{
    inputDefault            = tipText;
    messageLabel_.text      = tipText;
    messageLabel_.textColor = [_gesturePasswordView selectedColor];
}

- (void) setInputTipText:(NSString *)tipText
{
    inputTipText            = tipText;
    messageLabel_.text      = tipText;
    messageLabel_.textColor = [_gesturePasswordView selectedColor];
}

-(void) setGestureError:(BOOL *)error
{
    gestureError                = error;
    _gesturePasswordView.error  = error;
    
    // auto disappear
    __weak GesturePasswordView* weakpv  = _gesturePasswordView;
    NSUInteger sequence                 = weakpv.sequence;
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(2 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        if (weakpv.sequence == sequence) {
            [weakpv reset];
            messageLabel_.textColor = [weakpv selectedColor];
            messageLabel_.text      = inputDefault;
        }
    });
}

@end

//
//  GuesturePasswordView.h
//  Behome
//
//  Created by cluries on 6/12/14.
//  Copyright (c) 2014 com.iusworks. All rights reserved.
//

#import <UIKit/UIKit.h>

@class GesturePasswordView;

@protocol GesturePasswordViewDelegate <NSObject>

@optional;
- (void) gesturePasswordView:(GesturePasswordView*) passwordView  didEndInputWithPassword:(NSString*) password sequence:(NSUInteger) sequence;
- (void) gesturePasswordView:(GesturePasswordView*) passwordView  didCanceledWithSequence:(NSUInteger) sequence;
- (void) gesturePasswordView:(GesturePasswordView*) passwordView  didStartedWithSequence:(NSUInteger) sequence;

@end

@interface GesturePasswordView : UIView

@property (nonatomic,assign) id<GesturePasswordViewDelegate> delegate;
@property (nonatomic,assign) BOOL error; 
@property (nonatomic,readonly) NSUInteger sequence;

- (UIColor*) selectedColor;
- (void) reset;

@end

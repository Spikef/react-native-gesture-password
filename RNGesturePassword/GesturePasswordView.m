//
//  GuesturePasswordView.m
//  Behome
//
//  Created by cluries on 6/12/14.
//  Copyright (c) 2014 com.iusworks. All rights reserved.
//

#import "GesturePasswordView.h"
#import <QuartzCore/QuartzCore.h>

const static char kArcActiveOffset = 0x30 ;


static inline UIColor*
UIColorRGB(float r, float g, float b)
{
    return [UIColor colorWithRed:r/255.0 green:g/255.0 blue:b/255.0 alpha:1.0];
}

static bool
inArc(CGPoint point,CGPoint arcCenter,float arcRadius)
{
    float a = fabs(arcCenter.x - point.x);
    float b = fabs(arcCenter.y - point.y);
    if (a > arcRadius || b > arcRadius) {
        return false;
    }
    
    double c = sqrt(pow(a, 2) + pow(b, 2));
    
    return c <= arcRadius;
}


@implementation GesturePasswordView
{
    float radius_           ;
    float margin_           ;
    float largerRadius_     ;
    
    UIColor* arcLineColor_  ;
    UIColor* activeColor_   ;
    UIColor* errorColor_    ;
    
    CGPoint* arcCenters_    ;
    char     active_[10]    ;
    
    
    CGPoint  upPoint_       ;
    volatile NSUInteger sequence_;
}

- (instancetype) initWithFrame:(CGRect)frame
{
    if (self = [super initWithFrame:frame]) {
        margin_       = frame.size.width / 10;
        radius_       = margin_  ;
        largerRadius_ = radius_ * 1.25;
        arcLineColor_ = UIColorRGB(142, 145, 168);
        activeColor_  = UIColorRGB(95, 168, 252);
        errorColor_   = UIColorRGB(217, 54, 9);
        sequence_     = 0;
        
        arcCenters_   = (CGPoint*) malloc(sizeof(CGPoint) * 9);
        memset(arcCenters_, 0, sizeof(CGPoint) * 9);
        
        for (int i=0; i < 9; i++) {
            CGPoint* p = (arcCenters_ + i);
            
            (*p).x = (i % 3) * (radius_ * 2 + margin_) + margin_ + radius_;
            (*p).y = (i / 3) * (radius_ * 2 + margin_) + margin_ + radius_;
        }
        
        [self resetActice];
    }
    
    return self;
}


- (void) dealloc
{
    free(arcCenters_);
}



- (void) drawRect:(CGRect)rect
{
    for (int i=0; i < 9; i++) {
        UIBezierPath* bezierPath = [UIBezierPath bezierPathWithArcCenter:*(arcCenters_+i) radius:radius_  startAngle:0 endAngle:M_PI * 2 clockwise:NO];
        [bezierPath setLineWidth:1];
        if ([self arcActiveOrder:i] >= 0 ) {
            [[self selectedColor] setStroke];
            [[self selectedColor] setFill];
            [[UIBezierPath bezierPathWithArcCenter:*(arcCenters_+i) radius:radius_/3.0  startAngle:0 endAngle:M_PI * 2 clockwise:NO] fill];
        } else {
            [arcLineColor_ setStroke];
        }
        
        [bezierPath stroke];
    }
    
    int firstActiveArcNumber = active_[0] - kArcActiveOffset;
    if (firstActiveArcNumber < 0) {
        return;
    }
    
    UIBezierPath* linePath = [[UIBezierPath alloc] init];
    [linePath setLineWidth:1];
    [linePath moveToPoint:*(arcCenters_ + firstActiveArcNumber)];
    for (int i=0; i<9; i++) {
        if (active_[i] >= kArcActiveOffset) {
            int arcNumber = active_[i] - kArcActiveOffset;
            [linePath addLineToPoint:*(arcCenters_ + arcNumber)];
        } else {
            break;
        }
    }
    
    if (!CGPointEqualToPoint(CGPointZero, upPoint_)) {
        [linePath addLineToPoint:upPoint_];
    }
    
    [[self selectedColor] setStroke];
    
    [linePath stroke];
}


- (int) latestActiveArcNumber
{
    if (active_[0] == 0) {
        return -1;
    }
    
    int arcNumber = -1;
    for(int i =0;i<9;i++) {
        if (active_[i] == 0) {
            arcNumber = active_[i - 1] - kArcActiveOffset;
            break;
        }
    }
    
    return arcNumber;
}

- (int) arcActiveOrder:(int) arcNumber
{
    if (active_[0] == 0) {
        return -1;
    }
    
    int activeOrder = -1;
    for(int i =0; i<9; i++) {
        if (active_[i] - kArcActiveOffset == arcNumber) {
            activeOrder = i;
            break;
        }
    }
    
    return activeOrder;
}

- (NSUInteger) sequence
{
    return sequence_;
}

- (void) reset
{
    [self resetActice];
}

- (void) resetActice
{
    _error = NO;
    upPoint_.x = upPoint_.y = 0;
    
    memset(&active_, 0, sizeof(char) * 10);
    
    if (self.superview) {
        [self setNeedsDisplay];
    }
}


- (void) setError:(BOOL)error
{
    _error = error;
    [self setNeedsDisplay];
}

- (UIColor*) selectedColor
{
    return _error ? errorColor_ : activeColor_;
}

- (void) touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event
{
    ++ sequence_;
    
    [self resetActice];
    
    if (self.delegate && [self.delegate respondsToSelector:@selector(gesturePasswordView:didStartedWithSequence:)]) {
        [self.delegate gesturePasswordView:self didStartedWithSequence:sequence_];
    }
    
    UITouch* touch = [touches anyObject];
    if (touch == nil ) {
        return;
    }
    
    CGPoint point = [touch locationInView:self];
    for (int i=0; i < 9; i++) {
        if (inArc(point, *(arcCenters_+i), radius_)) {
            [self setArcActive:i];
            [self setNeedsDisplay];
            break;
        }
    }
}

- (void) touchesCancelled:(NSSet *)touches withEvent:(UIEvent *)event
{
    [self resetActice];
    if (self.delegate && [self.delegate respondsToSelector:@selector(gesturePasswordView:didCanceledWithSequence:)]) {
        [self.delegate gesturePasswordView:self didCanceledWithSequence:sequence_];
    }
}

- (void) touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event
{
    if (self.delegate && [self.delegate respondsToSelector:@selector(gesturePasswordView:didEndInputWithPassword:sequence:)]) {
        NSString* stringPassword = [NSString stringWithUTF8String:active_];
        [self.delegate gesturePasswordView:self didEndInputWithPassword:stringPassword sequence:sequence_];
    }
    
    upPoint_.x = upPoint_.y = 0;
}

- (void) touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event
{
    UITouch* touch = [touches anyObject];
    if (touch == nil ) {
        return;
    }
    
    
    CGPoint point = [touch locationInView:self];
    
    int latestActiveArcNumber = [self latestActiveArcNumber];
    if ( latestActiveArcNumber > -1) {
        CGPoint* latestArcCenter = arcCenters_ + latestActiveArcNumber;
        CGPoint midPoint;
        midPoint.x = (latestArcCenter->x + point.x)/2.0;
        midPoint.y = (latestArcCenter->y + point.y)/2.0;
        for (int i=0; i < 9; i++) {
            if (inArc(midPoint, *(arcCenters_+i), radius_ ) && [self arcActiveOrder:i] == -1) {
                [self setArcActive:i];
                [self setNeedsDisplay];
                break;
            }
        }
    }
    
    for (int i=0; i < 9; i++) {
        if (inArc(point, *(arcCenters_+i), radius_ ) && [self arcActiveOrder:i] == -1) {
            [self setArcActive:i];
            [self setNeedsDisplay];
            return;
        }
    }
    
    upPoint_.x = point.x ;
    upPoint_.y = point.y ;
    [self setNeedsDisplay];
}

- (void) setArcActive:(int) arcNumber
{
    for (int i=0; i < 9; i++) {
        if (active_[i] == 0) {
            active_[i] = arcNumber + kArcActiveOffset;
            break;
        }
    }
    
    upPoint_.x = upPoint_.y = 0;
}


@end

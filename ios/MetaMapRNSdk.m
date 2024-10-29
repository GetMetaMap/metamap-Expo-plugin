#import "MetaMapRNSdk.h"

@implementation MetaMapRNSdk {
    BOOL hasListeners;
}

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(showFlow:(NSString * _Nonnull)clientId
                  flowId:(NSString * _Nullable)flowId
                  metadata:(NSDictionary<NSString *, id> * _Nullable)metadata)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSMutableDictionary *mutableMetadata = [metadata mutableCopy] ?: [NSMutableDictionary new];
        mutableMetadata[@"sdkType"] = @"react-native-ios";
        
        [MetaMap.shared showMetaMapFlowWithClientId:clientId
                                             flowId:flowId
                                    configurationId:nil
                          encryptionConfigurationId:nil
                                           metadata:mutableMetadata];
        
        if (![MetaMapButtonResult shared].delegate) {
            [MetaMapButtonResult shared].delegate = self;
        }
        
        self->hasListeners = YES;
    });
}

RCT_EXPORT_METHOD(showFlowWithConfigurationId:(NSString * _Nonnull)clientId
                  flowId:(NSString * _Nullable)flowId
                  configurationId:(NSString * _Nullable)configurationId
                  encryptionConfigurationId:(NSString * _Nullable)encryptionConfigurationId
                  metadata:(NSDictionary<NSString *, id> * _Nullable)metadata)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        NSMutableDictionary *mutableMetadata = [metadata mutableCopy] ?: [NSMutableDictionary new];
        mutableMetadata[@"sdkType"] = @"expo-ios";
        
        [MetaMap.shared showMetaMapFlowWithClientId:clientId
                                             flowId:flowId
                                    configurationId:configurationId
                          encryptionConfigurationId:encryptionConfigurationId
                                           metadata:mutableMetadata];
        
        if (![MetaMapButtonResult shared].delegate) {
            [MetaMapButtonResult shared].delegate = self;
        }
        
        self->hasListeners = YES;
    });
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"verificationSuccess", @"verificationCanceled"];
}

- (void)verificationSuccessWithIdentityId:(NSString *)identityId verificationID:(nullable NSString *)verificationID {
    if (hasListeners) {
        [self sendEventWithName:@"verificationSuccess" body:@{@"identityId": identityId, @"verificationId": verificationID ?: [NSNull null]}];
    }
}

- (void)verificationCancelled {
    if (hasListeners) {
        [self sendEventWithName:@"verificationCanceled" body:nil];
    }
}

@end
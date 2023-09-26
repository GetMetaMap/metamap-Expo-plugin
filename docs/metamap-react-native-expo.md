

| LTS version (Recommended for most users): | Current Version(Latest features) |
|-------------------------------------------|----------------------------------|
| 2.2.0                                     | 2.2.0                            |

## Install MetaMap for React Native Expo
In a terminal, use the following command to install MetaMap for React Native:
1. Install the SDK:
   ```bash
   npm i react-native-expo-metamap-sdk
   ```
2. Add the followling line to your `app.json` file:
   ```json
   "plugins":["react-native-expo-metamap-sdk"]
   ```
3. Run EXPO for your platform:
   For iOS:
   ```bash
   expo run:ios
   ```
   For Android:
   ```bash
   expo run:android
   ```

## Example MetaMap React Native Implementation

The following is an example of the class Component.

```ruby
import React, {Component} from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  Button,
  View
} from 'react-native';

import {
  MetaMapRNSdk,
} from 'react-native-expo-metamap-sdk';

export default class App extends Component {
  constructor() {
    super();
    console.log('Constructor Called.');
  }

  componentDidMount() {
	 //set listening callbacks
  	const MetaMapVerifyResult = new NativeEventEmitter(NativeModules.MetaMapRNSdk)
 	 MetaMapVerifyResult.addListener('verificationSuccess', (data) => console.log(data))
 	 MetaMapVerifyResult.addListener('verificationCanceled', (data) => console.log(data))
  }

  //call showFlow when button is clicked
  handleMetaMapClickButton = () => {

	 //set 3 params clientId (cant be null), flowId, metadata
  	  var yourMetadata = { param1: "value1", param2: "value2" }

   	 MetaMapRNSdk.showFlow("YOUR_CLIENT_ID", "YOUR_FLOW_ID", yourMetadata);
  }

  //Add button to view graph
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'powderblue',
        }}>
        <Button onPress={this.handleMetaMapClickButton} title="Click here"/>
      </View>
    );
  }
}
```

The following is an example of the Function Component.

```ruby
import React, {Component, useEffect} from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  Button,
  View
} from 'react-native';

import {
  MetaMapRNSdk,
} from 'react-native-expo-metamap-sdk';


function App(props) {

    useEffect(() => {
     	const MetaMapVerifyResult = new NativeEventEmitter(NativeModules.MetaMapRNSdk)
     	MetaMapVerifyResult.addListener('verificationSuccess', (data) => console.log(data))
     	MetaMapVerifyResult.addListener('verificationCanceled', (data) => console.log(data))
    })
    const handleMetaMapClickButton = (props) => {

            //set 3 params clientId (cant be null), flowId, metadata
         var yourMetadata = { param1: "value1", param2: "value2" }
       	 MetaMapRNSdk.showFlow("610b96fb7cc893001b135505", "611101668083a1001b13cc80", yourMetadata);
      }

    return (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'powderblue',
            }}>
            <Button onPress = {() => handleMetaMapClickButton()}  title="Click here"/>
          </View>
        );
}
export default App;

```

Metadata is an additional optional parameter that can be used to replace certain settings:

### Set the Language:
By default the SDK language is set to "en" but it is editable to the language from the list: "es", "fr", "pt", "ru", "tr", "de", "it", "pl", "th".
```bash
metaData: {"fixedLanguage": "value"}
```

### Set the Button Color
By default main button color is white but it is editable by using hex Color format "hexColor".
```bash
metaData: {"buttonColor": "value"}
```

### Set the Title color of the button:
By default main button title color is black but it is editable by using hex Color format "hexColor".
```bash
metaData: {"buttonTextColor": "hexColor"}
```

### Set identity Id as parameter for re-verification:
```bash
metadata: {"identityId": "value"}
   ```

### Set encryption Configuration Id as parameter for encrypting data.
```bash
metaData: ["encryptionConfigurationId": "value"]
   ```

### Set customization fonts as parameter.
to add custom fonts, the project needs to have these font files, otherwise SDK will use default fonts:
```bash
metadata: ["regularFont": "REGULAR_FONT_NAME.ttf", "boldFont":  "BOLD_FONT_NAME.ttf"]
   ```

## Some error codes you may get during integration

`402` - MetaMap services are not paid: please contact your customer success manager

`403` - MetaMap credentials issues: please check your client id and MetaMap id

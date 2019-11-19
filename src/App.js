import React from 'react';

import {View, Text} from 'react-native';

import CodePush from 'react-native-code-push';

function App() {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 20}}>Rocketseat Experience</Text>
    </View>
  );
}

export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
})(App);

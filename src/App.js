import React, {useState} from 'react';

import {View, Text, TouchableOpacity} from 'react-native';

import CodePush from 'react-native-code-push';

function App() {
  const [hasUpdate, setHasUpdate] = useState(false);

  async function checkUpdate() {
    const update = await CodePush.checkForUpdate();

    setHasUpdate(update !== null ? true : false);
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 20}}>Rocketseat Experience</Text>

      <Text style={{color: '#f00', marginVertical: 20}}>
        {hasUpdate ? 'Nova atualização disponível' : 'Atualizado'}
      </Text>

      <TouchableOpacity
        style={{marginVertical: 20, backgroundColor: '#eee', padding: 20}}
        onPress={checkUpdate}>
        <Text>Check for update</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CodePush({
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
})(App);

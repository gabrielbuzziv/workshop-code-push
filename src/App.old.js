import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import CodePush from 'react-native-code-push';

function App() {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [version, setVersion] = useState(null);
  const [downloadable, setDownloadable] = useState(false);

  useEffect(() => {
    async function getCurrentVersion() {
      const current = await CodePush.getUpdateMetadata();

      setVersion(current);
    }

    async function updateAppOnLaunch() {
      const update = await CodePush.checkForUpdate();

      if (update === null) {
        return;
      }

      if (update.isMandatory) {
        setDownloadable(true);
      } else {
        CodePush.sync();
      }
    }

    getCurrentVersion();
    updateAppOnLaunch();
  });

  async function handleCheckForUpdates() {
    const update = await CodePush.checkForUpdate();

    setHasUpdate(update !== null ? true : false);
  }

  async function handleUpdate() {
    setLoading(true);
    try {
      await CodePush.sync(
        {
          updateDialog: false,
          installMode: CodePush.InstallMode.IMMEDIATE,
        },
        updateStatus => {
          switch (updateStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE: {
              setStatus('Verificando atualização');
              break;
            }
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE: {
              setStatus('Baixando pacotes');
              break;
            }
            case CodePush.SyncStatus.UP_TO_DATE: {
              setStatus('Atualizado');
              break;
            }
            case CodePush.SyncStatus.UPDATE_INSTALLED: {
              setStatus('Última versãon instalada');
              break;
            }
            default:
              setStatus('');
          }
        },
        () => CodePush.allowRestart(),
      );
    } catch (error) {
      setStatus('Não foi possível baixar atualização');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Workshop Codepush</Text>

      <Text style={{fontSize: 20, marginVertical: 20}}>
        {hasUpdate ? 'Nova atualização disponivel' : 'Nenhuma nova atualização'}
      </Text>

      {loading && (
        <Text style={{fontSize: 10, marginVertical: 20, flexDirection: 'row'}}>
          <ActivityIndicator size="small" />
          {status}
        </Text>
      )}

      {(hasUpdate || downloadable) && (
        <TouchableOpacity
          style={{backgroundColor: '#ccc', padding: 20}}
          onPress={handleUpdate}>
          <Text>Baixar atualizações</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={{backgroundColor: '#eee', padding: 20}}
        onPress={handleCheckForUpdates}>
        <Text>Verificar se há atualizações disponíveis</Text>
      </TouchableOpacity>

      {/* <Text
        style={{background: '#eee', marginTop: 40, padding: 10, fontSize: 10}}>
        {JSON.stringify(version, null, 4)}
      </Text> */}
    </View>
  );
}

export default CodePush({
  checkFrequency: CodePush.CheckFrequency.MANUAL,
})(App);

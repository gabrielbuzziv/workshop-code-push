import React, {useEffect, useState} from 'react';

import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import CodePush from 'react-native-code-push';

function App() {
  const [checking, setChecking] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Atualizado');
  const [mandatory, setMandatory] = useState(false);

  useEffect(() => {
    async function checkUpdate() {
      const update = await CodePush.checkForUpdate();

      if (update === null) {
        return;
      }

      if (update.isMandatory) {
        setHasUpdate(true);
        setMandatory(true);
      } else {
        CodePush.sync();
      }
    }

    checkUpdate();
  }, []);

  async function handleCheckForUpdate() {
    const update = await CodePush.checkForUpdate();

    setHasUpdate(update !== null ? true : false);
  }

  async function handleDownload() {
    setLoading(true);

    try {
      await CodePush.sync(
        {updateDialog: false, installMode: CodePush.InstallMode.IMMEDIATE},
        syncStatus => {
          switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
              setStatus('Verificando atualizações');
              break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
              setStatus('Baixando o pacote');
              break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
              setStatus('Instalando a atualização');
              break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
              setStatus('Atualização Concluída');
              break;
            default:
              setStatus('Atualizado');
          }
        },
        () => CodePush.allowRestart(),
      );
    } catch (error) {
      setStatus('Falha ao atualizar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {mandatory && (
        <View
          style={{
            backgroundColor: '#fff',
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text style={{fontSize: 30, marginBottom: 20}}>
            ATUALIZAÇÃO OBRIGATORIA
          </Text>

          <View
            style={{
              height: 1,
              backgroundColor: '#ddd',
              marginVertical: 20,
              width: '100%',
            }}
          />

          {loading && (
            <Text
              style={{
                color: '#ff6600',
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ActivityIndicator size="small" />
              {status}
            </Text>
          )}

          {hasUpdate && (
            <TouchableOpacity
              style={{backgroundColor: '#ddd', padding: 20, marginBottom: 20}}
              onPress={handleDownload}>
              <Text>Baixar atualização</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <View
        style={{
          backgeoundColor: '#f00',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{fontSize: 30}}>Rocketseat Experience</Text>
        <Text style={{fontSize: 20, marginBottom: 20}}>Workshop Codepush</Text>
      </View>
    </>
  );
}

export default CodePush({checkFrequency: CodePush.CheckFrequency.MANUAL})(App);

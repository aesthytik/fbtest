/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {LoginButton, AccessToken} from 'react-native-fbsdk';
import {fetchAPI} from './utils/helpers';

const App: () => React$Node = () => {
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   const external_token = `EAAHxvumhWwUBAE9IPLOq7NldNodoVT0ydSLFbLQosBqDbVn1g85ZB6WAVOt65SEb5OUzI9aackWPrMlAZBn99F5h6C06MY7p4ZCbkxAazNG0fBdxzusF8beUZAG6TQNNdcDFaVSF3OOeaalSKHZCFgJzR7v3xkkq9DHnLZAvceBQXxHDMV7DTwZBdeSVMt3qVxsMTQsypgBxWQcp4iQZAfju82czM7xWZCxqTG6CuZAYsJxQZDZD`;
  //   const fetchData = async () => {
  //     const data = await fetchAPI(external_token);
  //     console.log('fetchData', data);
  //     Alert.alert(data.status);
  //   };
  //   fetchData();
  // }, []);

  const external_token = `EAAHxvumhWwUBAE9IPLOq7NldNodoVT0ydSLFbLQosBqDbVn1g85ZB6WAVOt65SEb5OUzI9aackWPrMlAZBn99F5h6C06MY7p4ZCbkxAazNG0fBdxzusF8beUZAG6TQNNdcDFaVSF3OOeaalSKHZCFgJzR7v3xkkq9DHnLZAvceBQXxHDMV7DTwZBdeSVMt3qVxsMTQsypgBxWQcp4iQZAfju82czM7xWZCxqTG6CuZAYsJxQZDZD`;

  const handleFetch = token => {
    setLoading(true);
    const external_token = `EAAHxvumhWwUBAE9IPLOq7NldNodoVT0ydSLFbLQosBqDbVn1g85ZB6WAVOt65SEb5OUzI9aackWPrMlAZBn99F5h6C06MY7p4ZCbkxAazNG0fBdxzusF8beUZAG6TQNNdcDFaVSF3OOeaalSKHZCFgJzR7v3xkkq9DHnLZAvceBQXxHDMV7DTwZBdeSVMt3qVxsMTQsypgBxWQcp4iQZAfju82czM7xWZCxqTG6CuZAYsJxQZDZD`;
    const fetchData = async () => {
      const data = await fetchAPI(external_token);
      console.log('fetchData', data);
      setLoading(false);
      Alert.alert(data.status);
    };
    fetchData();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{
          flexDirection: 'row',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <LoginButton
              publishPermissions={['public_profile']}
              onLoginFinished={(error, result) => {
                if (error) {
                  console.log('login has error: ' + result.error);
                } else if (result.isCancelled) {
                  console.log('login is cancelled.');
                } else {
                  AccessToken.getCurrentAccessToken().then(data => {
                    console.log(data);
                    handleFetch(data.accessToken.toString());
                  });
                }
              }}
              onLogoutFinished={() => console.log('logout.')}
            />

            {loading && <ActivityIndicator size="large" color="#0000ff" />}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

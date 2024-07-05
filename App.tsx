import React, { useState, useEffect } from 'react';
import banner from './assets/banner.png'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import PushNotification from 'react-native-push-notification';

const App = () => {
  const [buttons, setButtons] = useState(
    Array.from({ length: 20 }, () => ({
      state: null,
      type: null,
      startTime: Date.now(),
      elapsedTime: Date.now()
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setButtons((prevButtons) =>
        prevButtons.map((button,index) => {
            if (index > 10)    {button.state = 'disabled' ; button.type = 'disabled'}

          if (!button.startTime || button.state == 'disabled') return button;
          button.elapsedTime = (Date.now() - button.startTime) / 1000;
          const elTime = button.elapsedTime
          if (elTime > 60) {button.state = 'alarm' ; button.type = 'bill'}
          else if (elTime > 30)  {button.state = 'warning' ; button.type = 'attention'}
          else if (elTime > 10)  {button.state = 'call' ; button.type = 'attention'}

           return button;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonPress = (index) => {
    const currentButton = buttons[index];
    if (!currentButton.startTime || currentButton.state == 'disabled') return currentButton;

    const elapsedTime = currentButton.startTime
      ? Math.floor((Date.now() - currentButton.startTime) / 1000)
      : 0;
    Alert.alert(
      `Button ${index + 1}`,
      `Time since color change: ${elapsedTime} seconds`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => handleReset(index),
        },
      ]
    );
  };

  const handleReset = (index) => {
    setButtons((prevButtons) =>
      prevButtons.map((button, i) =>
        i === index
          ? { color: 'transparent', startTime: Date.now() }
          : button
      )
    );
  };
const getImageSource = (type) => {
    switch (type) {
      case 'bill':
        return require('./assets/bill.png');
      case 'attention':
        return require('./assets/bell.png');
      case 'disabled':
              return require('./assets/disabled.jpg');
      default:
        return require('./assets/default.png');
    }
  };

  const renderButtons = () => {
    return buttons.map((button, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.buttonContainer, buttonColorStyle(button.state)]}
        onPress={() => handleButtonPress(index)}
      >
      <Text style={styles.buttonText}>{index + 1}</Text>
       <Text style = {styles.buttonText}>{button.elapsedTime}</Text>
        <Image
          source={getImageSource(button.type)}
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    ));
  };

  const buttonColorStyle = (state) => {

    switch (state) {
      case 'disabled':
          return styles.buttonDisabled;
      case 'call':
        return styles.buttonCall;
      case 'warning':
        return styles.buttonOrange;
      case 'alarm':
        return styles.buttonRed;
      default:
        return styles.buttonDefault;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.banner}>
            <Image source= {banner}
            style={styles.bannerImage} />
        </View>
        <Text style = {styles.userText}>  Captain: Surendra </Text>
        <View style={styles.grid}>{renderButtons()}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  bannerImage:{
      height: 60,
      objectFit: 'contain',
  },
  banner: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    width: '22%',
    margin: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius : 20
  },
   buttonText: {
      color: '#fff',
      fontSize: 14,
    },
  buttonImage: {
    width: 40,
    height: 40,
  },
  buttonDefault: {
    backgroundColor: 'transparent',
  },

  buttonCall: {
    backgroundColor: 'green',
  },
  buttonOrange: {
    backgroundColor: 'orange',
  },
  buttonRed: {
    backgroundColor: 'red',
  },
  userText: {
      color: 'red',
      fontSize: 20,
      alignItems: 'center'
    },
  buttonDisabled: {
      backgroundColor: 'transparent'
      }
});

export default App;

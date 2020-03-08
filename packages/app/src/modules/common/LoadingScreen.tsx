import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

import logo from '../../assets/logo.png';

const Container = styled.SafeAreaView`
  background: #fff;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const offset = new Animated.ValueXY({ x: 0, y: 0 });

const LoadingScreen: React.FC = () => {
  function runAnimation() {
    Animated.sequence([
      Animated.timing(offset.y, {
        toValue: -25,
        duration: 1000,
        useNativeDriver: true,
      }),

      Animated.timing(offset.y, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => runAnimation());
  }

  useEffect(() => {
    runAnimation();
  }, []);

  return (
    <Container>
      <Animated.Image
        source={logo}
        style={[{ transform: [...offset.getTranslateTransform()] }, { width: 150, height: 150 }]}
      />
    </Container>
  );
};

export default LoadingScreen;

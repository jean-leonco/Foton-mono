import React, { useEffect } from 'react';
import { ActivityIndicator, Animated } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

const Container = styled(RectButton)`
  height: 45px;
  background: #4b3bff;
  border-radius: 4px;

  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
`;

const opacity = new Animated.Value(0.5);

const AnimatedContainer = Animated.createAnimatedComponent(Container);

interface Props {
  style?: any;
  loading?: boolean;
  empty?: boolean;
  onPress(): void;
}

const Button: React.FC<Props> = ({ style = [], children, loading, empty, onPress }) => {
  const enable = Animated.timing(opacity, {
    toValue: 1,
    duration: 100,
  });

  const disable = Animated.timing(opacity, {
    toValue: 0.5,
    duration: 200,
  });

  useEffect(() => {
    if (!empty) {
      enable.start();
    } else if (empty) {
      disable.start();
    } else if (!loading) {
      enable.start();
    } else if (loading) {
      disable.stop();
    }
  }, [empty, loading, disable, enable]);

  return (
    <AnimatedContainer empty={empty} enabled={!loading && !empty} onPress={onPress} style={[...style, { opacity }]}>
      {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text>{children}</Text>}
    </AnimatedContainer>
  );
};

export default Button;

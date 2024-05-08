import { PureComponent } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  PanResponder,
} from "react-native";
const { height: phoneHeight, width: phoneWidth } = Dimensions.get("window");
export default class BottomSheet extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.translateY = new Animated.Value(this.props.height);
  }
  open = () => {
    const { openDuration } = this.props;
    this.setState(
      { visible: true },
      Animated.timing(this.translateY, {
        toValue: 0,
        duration: openDuration,
        useNativeDriver: true,
      }).start
    );
  };
  close = (duration = null) => {
    const { height, closeDuration } = this.props;
    Animated.timing(this.translateY, {
      toValue: height,
      duration: duration ? duration : closeDuration,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      this.setState({ visible: false });
    }, (duration ? duration : closeDuration) + 100);
  };
  pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const { dy } = gestureState;
      if (dy > 0) {
        this.translateY.setValue(dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      const { dy } = gestureState;
      const { height, closeDuration, closeOnDragDown } = this.props;
      if (dy > height / 2 && closeOnDragDown) this.close(closeDuration / 2);
      else
        Animated.timing(this.translateY, {
          toValue: 0,
          duration: closeDuration / 2,
          useNativeDriver: true,
        }).start();
    },
  });
  render() {
    const { visible } = this.state;
    const {
      containerStyle,
      closeOnBackdropPress,
      height,
      showDragIconContainer,
      iconContainerStyle,
      dragIcon,
      children,
      closeOnBackPress,
      backdropOpacity,
    } = this.props;
    const opacity = this.translateY.interpolate({
      inputRange: [0, height],
      outputRange: [backdropOpacity, 0],
    });
    return (
      <Modal
        onRequestClose={() => {
          if (closeOnBackPress) this.close();
        }}
        transparent
        visible={visible}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            if (closeOnBackdropPress) {
              this.close();
            }
          }}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              styles.backdrop,
              { opacity },
            ]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.container,
            containerStyle,
            {
              height,
              width: phoneWidth,
              transform: [{ translateY: this.translateY }],
            },
          ]}
        >
          {showDragIconContainer ? (
            <View
              {...this.pan.panHandlers}
              style={[styles.header, iconContainerStyle]}
            >
              {dragIcon}
            </View>
          ) : null}
          {children}
        </Animated.View>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "#000",
  },
  container: {
    backgroundColor: "#FFF",
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  header: {
    padding: 20,
    width: "100%",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});
BottomSheet.defaultProps = {
  height: phoneHeight / 2,
  openDuration: 400,
  closeDuration: 400,
  containerStyle: {},
  closeOnBackdropPress: true,
  closeOnBackPress: true,
  showDragIconContainer: true,
  iconContainerStyle: {},
  dragIcon: (
    <View
      style={{
        width: 40,
        height: 5,
        backgroundColor: "#B3B3B3",
        borderRadius: 5,
      }}
    />
  ),
  closeOnDragDown: true,
  backdropOpacity: 0.6,
};

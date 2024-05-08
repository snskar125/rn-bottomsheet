# @snskar125/rn-bottomsheet
Bottomsheet Component for React Native

## Usage
```javascript
import Bottomsheet from "@snskar125/rn-bottomsheet";
import { Button } from "react-native";
import { useRef } from "react";
export default function App() {
  const bottomSheet = useRef();
  return (
    <>
      <Button
        onPress={() => {
          bottomSheet.current?.open();
        }}
        title={"Bottomsheet"}
      />
      <Bottomsheet ref={bottomSheet} />
    </>
  );
}
```

## Props
| Prop                  | Type       |
| --------------------- | ---------- |
| height                | Number     |
| openDuration          | Number     |
| closeDuration         | Number     |
| containerStyle        | View Style |
| closeOnBackdropPress  | Boolean    |
| closeOnBackPress      | Boolean    |
| showDragIconContainer | Boolean    |
| iconContainerStyle    | View Style |
| dragIcon              | Element    |
| closeOnDragDown       | Boolean    |
| backdropOpacity       | Number     |

## Methods
open()<br>
close()

import React, { useState } from 'react';
import Keyboard from 'react-simple-keyboard';
import styled from 'styled-components';
import 'react-simple-keyboard/build/css/index.css';
import { koreanLayout } from './koreanLayout';
import hangul from 'hangul-js';

const CustomKeyboard = ({ text, setText }) => {
  const [layoutName, setLayoutName] = useState('default'); // default, shift

  const onKeyPress = (key) => {
    if (key === '{pre}') {
      const res = text.slice(0, -1);
      setText(res);
    } else if (key === '{shift}') {
      setLayoutName((prev) => {
        if (prev === 'default') return 'shift';
        else if (prev === 'shift') return 'default';
        else if (prev === 'lan') return 'shiftLan';
        else if (prev === 'shiftLan') return 'lan';
      });
    } else if (key === '{lan}') {
      setLayoutName((prev) => (prev === 'default' || prev === 'shift' ? 'lan' : 'default'));
    } else if (key === '{enterNum}' || key === '{enterText}') {
      console.log('enter clicked!');
    } else if (key === '{dot}') {
      setText((prev) => prev + '.');
    } else if (key === '{space}') {
      setText((prev) => prev + ' ');
    } else {
      setText((prev) => hangul.assemble(hangul.disassemble(prev + key)));
    }
  };

  return (
    <KeyboardWrapper>
      <Keyboard
        layoutName={layoutName}
        layout={{ ...koreanLayout }}
        onKeyPress={onKeyPress}
        display={{
          '{enterText}': 'Enter',
          '{shift}': '↑',
          '{.}': '.',
          '{space}': 'spacebar',
          '{dot}': '.',
          '{pre}': '←',
          '{lan}': '언어',
        }}
      />
    </KeyboardWrapper>
  );
};

const KeyboardWrapper = styled.div`
  width: 800px;
`;
export default CustomKeyboard;

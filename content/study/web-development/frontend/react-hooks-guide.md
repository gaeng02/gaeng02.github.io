---
title: "React Hooks 완벽 가이드"
date: "2024-01-15"
tags: ["React", "JavaScript", "Frontend", "Hooks"]
description: "React Hooks의 모든 것을 알아보는 심화 학습 가이드"
---

# React Hooks 완벽 가이드

## 개요
React Hooks는 함수형 컴포넌트에서 상태와 생명주기를 관리할 수 있게 해주는 기능입니다. 클래스 컴포넌트 없이도 React의 모든 기능을 사용할 수 있게 해줍니다.

## 기본 Hooks

### useState
상태를 관리하는 가장 기본적인 Hook입니다.

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### useEffect
컴포넌트의 생명주기와 관련된 작업을 수행합니다.

```jsx
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]); // userId가 변경될 때만 실행

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### useContext
Context API를 더 쉽게 사용할 수 있게 해줍니다.

```jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <button 
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`btn btn-${theme}`}
    >
      Toggle Theme
    </button>
  );
}
```

## 추가 Hooks

### useReducer
복잡한 상태 로직을 관리할 때 사용합니다.

```jsx
import React, { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

### useCallback
함수를 메모이제이션하여 성능을 최적화합니다.

```jsx
import React, { useState, useCallback } from 'react';

function ExpensiveComponent({ onCalculate }) {
  const [result, setResult] = useState(0);

  const handleClick = useCallback(() => {
    const calculated = onCalculate();
    setResult(calculated);
  }, [onCalculate]);

  return (
    <div>
      <button onClick={handleClick}>Calculate</button>
      <p>Result: {result}</p>
    </div>
  );
}
```

### useMemo
값을 메모이제이션하여 성능을 최적화합니다.

```jsx
import React, { useState, useMemo } from 'react';

function ExpensiveCalculation({ numbers }) {
  const expensiveValue = useMemo(() => {
    console.log('Computing expensive value...');
    return numbers.reduce((sum, num) => sum + num, 0);
  }, [numbers]);

  return <div>Sum: {expensiveValue}</div>;
}
```

## 커스텀 Hooks

자주 사용하는 로직을 재사용 가능한 Hook으로 만들 수 있습니다.

```jsx
import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// 사용 예시
function App() {
  const [name, setName] = useLocalStorage('name', '');
  
  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Enter your name"
    />
  );
}
```

## Hooks 사용 규칙

1. **최상위에서만 Hook을 호출하세요**
   - 반복문, 조건문, 중첩된 함수 내부에서 Hook을 호출하지 마세요.

2. **React 함수 컴포넌트에서만 Hook을 호출하세요**
   - 일반 JavaScript 함수에서 Hook을 호출하지 마세요.

## 성능 최적화 팁

1. **의존성 배열을 정확히 지정하세요**
2. **useCallback과 useMemo를 적절히 사용하세요**
3. **불필요한 리렌더링을 방지하세요**

## 다음 단계
- React.memo와 함께 사용하기
- Suspense와 함께 사용하기
- Concurrent Mode에서의 Hooks

## 참고 자료
- [React Hooks 공식 문서](https://reactjs.org/docs/hooks-intro.html)
- [useHooks.com](https://usehooks.com/)

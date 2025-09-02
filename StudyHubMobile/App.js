import { NavigationContainer } from '@react-navigation/native';
import { useReducer } from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MyUserContext, MyDispatchContext } from "./configs/MyContexts";

import Register from './components/User/Register';
import Login from './components/User/Login';
import Home from './components/Home/Home';
import Profile from './components/User/Profile';
import Course from './components/Course/Course';
import Header from './components/Home/layout/Header';
import BottomNav from './components/Home/layout/BottomNav';
import Module from './components/Course/Module';
import Lesson from './components/Course/Lesson';
import Discuss from './components/Discuss/Discuss';
import Notification from './components/User/Notification';
import Resource from './components/Resource/Resource';
import NotifiDetail from './components/User/NotifiDetail';
import Quiz from './components/Quiz/Quiz';
import QuizDetail from './components/Quiz/QuizDetail';
import ResourceDetail from './components/Resource/ResourceDetail';

const MyUserReducer = (state, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "updateUser":
      return { ...state, user: action.payload };
    case "logout":
      return { user: null, token: null };
    default:
      return state;
  }
};

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, { user: null, token: null });

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Header" component={Header} />
            <Stack.Screen name="BottomNav" component={BottomNav} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Resource" component={Resource} />
            <Stack.Screen name="ResourceDetail" component={ResourceDetail} />

            <Stack.Screen name="Notification" component={Notification} />
            <Stack.Screen name="NotifiDetail" component={NotifiDetail} />
            <Stack.Screen name="Course" component={Course} />
            <Stack.Screen name="Module" component={Module} />
            <Stack.Screen name="Lesson" component={Lesson} />
            <Stack.Screen name="Discuss" component={Discuss} />
            <Stack.Screen name="Quiz" component={Quiz} />
            <Stack.Screen name="QuizDetail" component={QuizDetail} />

          </Stack.Navigator>
        </NavigationContainer>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { authService } from '../services/authService';

// [중요] 화면 파일들 가져오기
import {
  LoginScreen,
  RegisterScreen,
  HomeScreen,
  SearchScreen,
  MyPageScreen,
  NotificationSettingsScreen,
  ChangePasswordScreen,
  StatisticsScreen,
  HelpScreen,
  AppInfoScreen,
} from '../screens';

// [중요] 새로 만든 약 상세 화면 가져오기
// 만약 빨간줄이 뜬다면 src/screens 폴더 안에 PillDetailScreen.tsx 파일이 있는지 꼭 확인하세요!
import PillDetailScreen from '../screens/PillDetailScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Search: undefined;
  MyPage: undefined;
  PillDetail: { pill: any };
  AddPill: undefined;
  NotificationSettings: undefined;
  ChangePassword: undefined;
  Statistics: undefined;
  Help: undefined;
  AppInfo: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const loggedIn = await authService.isLoggedIn();
    setIsLoggedIn(loggedIn);
  };

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={isLoggedIn ? 'Home' : 'Login'}
      >
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Main Screens */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="MyPage" component={MyPageScreen} />

        {/* [중요] 여기에 오타가 있었을 확률이 높습니다. 끝에 /> 를 꼭 확인하세요! */}
        <Stack.Screen name="PillDetail" component={PillDetailScreen} />

        {/* Settings Screens */}
        <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="AppInfo" component={AppInfoScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
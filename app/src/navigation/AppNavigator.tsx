import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { authService } from '../services/authService';
import {
  LoginScreen,
  RegisterScreen,
  FindAccountScreen, // ✨ [추가됨] import 추가
  HomeScreen,
  SearchScreen,
  MyPageScreen,
  NotificationSettingsScreen,
  ChangePasswordScreen,
  StatisticsScreen,
  HelpScreen,
  AppInfoScreen,
  CalendarScreen,
  CameraScreen,
  AddPillScheduleScreen,
  EditProfileScreen,
  CompleteProfileScreen,
  PillDetailScreen,
} from '../screens';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  FindAccount: undefined; // ✨ [추가됨] 네비게이션 타입 정의
  CompleteProfile: undefined;
  Home: undefined;
  Search: undefined;
  MyPage: undefined;
  PillDetail: { pill: any };
  AddPill: undefined;
  AddPillSchedule: { pill: any };
  NotificationSettings: undefined;
  ChangePassword: undefined;
  EditProfile: undefined;
  Statistics: undefined;
  Help: undefined;
  AppInfo: undefined;
  Calendar: undefined;
  Camera: undefined;
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
          {/* ✨ [추가됨] 아이디/비번 찾기 화면 등록 */}
          <Stack.Screen name="FindAccount" component={FindAccountScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} />

          {/* Main Screens */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="MyPage" component={MyPageScreen} />

          {/* Settings Screens */}
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="AppInfo" component={AppInfoScreen} />

          {/* Feature Screens */}
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="AddPillSchedule" component={AddPillScheduleScreen} />
          <Stack.Screen name="PillDetail" component={PillDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
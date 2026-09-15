// Root App Layout & Providers
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/store/AuthContext';
import { LandProvider } from '../src/store/LandContext';
import { VerificationProvider } from '../src/store/VerificationContext';
import { AppointmentProvider } from '../src/store/AppointmentContext';
import { NotificationProvider } from '../src/store/NotificationContext';
import { DemoRoleSwitcher } from '../src/components/demo/DemoRoleSwitcher';
import { COLORS } from '../src/constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LandProvider>
          <VerificationProvider>
            <AppointmentProvider>
              <NotificationProvider>
                <StatusBar style="dark" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: COLORS.background },
                    animation: 'slide_from_right',
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="property/[id]"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="property/verify-title"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="payment/[id]"
                    options={{
                      headerShown: false,
                      presentation: 'modal',
                    }}
                  />
                  <Stack.Screen
                    name="seller/submit"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="seller/listing-detail"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="surveyor/review/[id]"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="advisor/book"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="documents/[id]"
                    options={{ headerShown: false }}
                  />
                </Stack>
                {/* Global Defense Demo Role Switcher */}
                <DemoRoleSwitcher />
              </NotificationProvider>
            </AppointmentProvider>
          </VerificationProvider>
        </LandProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// Animated Launch & Brand Splash Screen
// Automatically transitions to Home Screen with rich animations, logo, and headline
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  Easing,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS } from '../src/constants/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(24)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Logo entrance (fade + spring scale)
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Continuous subtle pulse loop for outer aura ring
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 3. Headline & text slide in slightly after logo
    Animated.parallel([
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 800,
        delay: 350,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Progress bar fill
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    // 5. Automatic transition directly to Home screen (No action required)
    const timer = setTimeout(() => {
      pulseLoop.stop();
      router.replace('/(tabs)');
    }, 2400);

    return () => {
      clearTimeout(timer);
      pulseLoop.stop();
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 0.45],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      {/* Subtle Background Radial Geometry */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <View style={styles.centerContainer}>
        {/* Creative Logo with animated pulse aura */}
        <View style={styles.logoWrapper}>
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: logoOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.35],
                }),
              },
            ]}
          />

          <Animated.View
            style={[
              styles.logoBadge,
              {
                opacity: logoOpacity,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            {/* Primary Cadastral Shield */}
            <View style={styles.shieldBackground}>
              <Ionicons name="shield-checkmark" size={54} color="#FFFFFF" />
            </View>

            {/* Accent Geographic Pin Badge */}
            <View style={styles.pinBadge}>
              <Ionicons name="location" size={18} color="#0D47A1" />
            </View>
          </Animated.View>
        </View>

        {/* Brand Name & Creative Headline */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: contentFade,
              transform: [{ translateY: contentTranslateY }],
            },
          ]}
        >
          <Text style={styles.brandTitle}>TerraVerify</Text>
          <Text style={styles.tagline}>
            National Cadastral Land Title Verification & Certified Property Exchange
          </Text>

          {/* Cameroon Authenticity Badge */}
          <View style={styles.countryBadge}>
            <View style={styles.countryBadgeDot} />
            <Text style={styles.countryBadgeText}>
              REPUBLIC OF CAMEROON • CADASTRE SÉCURISÉ
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Loading Progress Indicator */}
      <Animated.View style={[styles.bottomContainer, { opacity: contentFade }]}>
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.loadingText}>Initializing secure cadastral protocol...</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark, // Rich royal navy background
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  decorCircle1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(25, 118, 210, 0.15)',
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -60,
    left: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(0, 82, 204, 0.12)',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    marginTop: -30,
  },
  logoWrapper: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  pulseRing: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    position: 'relative',
  },
  shieldBackground: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 340,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  countryBadgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981', // Verified green indicator
    marginRight: SPACING.xs + 2,
  },
  countryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  bottomContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.lg,
  },
  progressBarTrack: {
    width: width * 0.45,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.3,
  },
});

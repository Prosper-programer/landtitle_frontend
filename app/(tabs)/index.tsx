// Dynamic Home/Dashboard Route based on active authenticated role
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../src/store/AuthContext';
import { BuyerHome } from '../../src/components/dashboard/BuyerHome';
import { SellerHome } from '../../src/components/dashboard/SellerHome';
import { SurveyorHome } from '../../src/components/dashboard/SurveyorHome';
import { AdvisorHome } from '../../src/components/dashboard/AdvisorHome';
import { AdminHome } from '../../src/components/dashboard/AdminHome';
import { COLORS } from '../../src/constants/theme';

export default function TabHomeScreen() {
  const { role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
      </View>
    );
  }

  switch (role) {
    case 'seller':
      return <SellerHome />;
    case 'surveyor':
      return <SurveyorHome />;
    case 'advisor':
      return <AdvisorHome />;
    case 'admin':
      return <AdminHome />;
    case 'buyer':
    case 'visitor':
    default:
      return <BuyerHome />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
});

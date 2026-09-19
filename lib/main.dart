import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'l10n/app_strings.dart';
import 'providers/locale_provider.dart';
import 'providers/user_profile_provider.dart';
import 'theme/app_theme.dart';
import 'theme/app_colors.dart';
import 'screens/home/home_screen.dart';
import 'screens/discover/discover_screen.dart';
import 'screens/referral/referral_screen.dart';
import 'screens/portfolio/portfolio_pro_screen.dart';
import 'screens/profile/profile_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MyDanThossApp());
}

class MyDanThossApp extends StatelessWidget {
  const MyDanThossApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LocaleProvider()..load()),
        ChangeNotifierProvider(create: (_) => UserProfileProvider()..load()),
      ],
      child: Consumer<LocaleProvider>(
        builder: (context, localeProvider, _) {
          return MaterialApp(
            title: 'MyDan_thoss',
            debugShowCheckedModeBanner: false,
            theme: AppTheme.lightTheme,
            locale: localeProvider.locale,
            supportedLocales: AppLanguage.values
                .map((l) => Locale(l.code))
                .toList(),
            localizationsDelegates: const [
              GlobalMaterialLocalizations.delegate,
              GlobalWidgetsLocalizations.delegate,
              GlobalCupertinoLocalizations.delegate,
            ],
            home: const MainScreen(),
          );
        },
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  static const List<Widget> _screens = [
    HomeScreen(),
    DiscoverScreen(),
    ReferralScreen(),
    PortfolioProScreen(),
    ProfileScreen(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final destinations = [
      NavigationDestination(
        icon: const Icon(Icons.grid_view_outlined),
        selectedIcon: const Icon(Icons.grid_view),
        label: t['navHome'],
      ),
      NavigationDestination(
        icon: const Icon(Icons.history_outlined),
        selectedIcon: const Icon(Icons.history),
        label: t['navTools'],
      ),
      NavigationDestination(
        icon: const Icon(Icons.card_giftcard_outlined),
        selectedIcon: const Icon(Icons.card_giftcard),
        label: t['navReferral'],
      ),
      NavigationDestination(
        icon: const Icon(Icons.pie_chart_outline),
        selectedIcon: const Icon(Icons.pie_chart),
        label: t['navMyPortfolio'],
      ),
      NavigationDestination(
        icon: const Icon(Icons.person_outline),
        selectedIcon: const Icon(Icons.person),
        label: t['navProfile'],
      ),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: _onItemTapped,
        backgroundColor: AppColors.blueDark,
        indicatorColor: Colors.white.withValues(alpha: 0.15),
        destinations: destinations,
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        height: 72,
        elevation: 8,
      ),
    );
  }
}
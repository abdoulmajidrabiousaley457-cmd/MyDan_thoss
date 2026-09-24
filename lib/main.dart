import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'l10n/app_strings.dart';
import 'providers/locale_provider.dart';
import 'providers/user_profile_provider.dart';
import 'theme/app_theme.dart';
import 'widgets/app_drawer.dart';
import 'widgets/main_nav_bar.dart';
import 'screens/home/home_screen.dart';
import 'screens/discover/discover_screen.dart';
import 'screens/product/product_screen.dart';
import 'screens/portfolio/portfolio_pro_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/library/library_screen.dart';
import 'screens/settings/security_privacy_screen.dart';
import 'screens/ai_agent/ai_agent_screen.dart';

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
            title: 'My_danthoss',
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
            // Clamp the system text scale so layouts stay pixel-perfect and
            // never overflow on any device (small phones, large phones, web).
            builder: (context, child) {
              final mq = MediaQuery.of(context);
              return MediaQuery(
                data: mq.copyWith(
                  textScaler: mq.textScaler.clamp(
                    minScaleFactor: 0.9,
                    maxScaleFactor: 1.2,
                  ),
                ),
                child: child ?? const SizedBox.shrink(),
              );
            },
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
    ProductScreen(),
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
    final items = buildNavItems(t);

    return Scaffold(
      key: appScaffoldKey,
      drawer: AppDrawer(
        selectedIndex: _selectedIndex,
        onSelectTab: _onItemTapped,
        extras: [
          DrawerDestination(
            icon: Icons.smart_toy_outlined,
            label: t['aiAgent'],
            subtitle: t['aiAgentDesc'],
            builder: () => const AiAgentScreen(),
          ),
          DrawerDestination(
            icon: Icons.library_books,
            label: t['libraryTitle'],
            subtitle: t['librarySubtitle'],
            builder: () => const LibraryScreen(),
          ),
          DrawerDestination(
            icon: Icons.security,
            label: t['securityTitle'],
            builder: () => const SecurityPrivacyScreen(),
          ),
        ],
      ),
      body: IndexedStack(index: _selectedIndex, children: _screens),
      bottomNavigationBar: MainNavBar(
        selectedIndex: _selectedIndex,
        onSelected: _onItemTapped,
        items: items,
      ),
    );
  }
}

import 'dart:math';
import '../models/stock_index.dart';
import '../models/stock.dart';

/// Mock Data Service for Development
class MockDataService {
  static final Random _random = Random();

  // Generate mock stock indices
  static List<StockIndex> getMockIndices() {
    return [
      StockIndex(
        name: 'Shanghai Composite',
        code: 'SH000001',
        current: 3245.67,
        change: 35.28,
        changePercent: 1.10,
        open: 3210.39,
        high: 3256.82,
        low: 3205.14,
        volume: '356.2B',
        chartData: _generateChartData(3200, 3250, 50),
      ),
      StockIndex(
        name: 'Shenzhen Component',
        code: 'SZ399001',
        current: 10856.23,
        change: -45.67,
        changePercent: -0.42,
        open: 10901.90,
        high: 10920.45,
        low: 10842.11,
        volume: '425.8B',
        chartData: _generateChartData(10850, 10900, 50),
      ),
      StockIndex(
        name: 'ChiNext',
        code: 'SZ399006',
        current: 2234.56,
        change: 12.34,
        changePercent: 0.56,
        open: 2222.22,
        high: 2245.78,
        low: 2218.90,
        volume: '182.5B',
        chartData: _generateChartData(2220, 2240, 50),
      ),
      StockIndex(
        name: 'SSE 50',
        code: 'SH000016',
        current: 2789.45,
        change: 23.12,
        changePercent: 0.84,
        open: 2766.33,
        high: 2795.67,
        low: 2762.11,
        volume: '156.3B',
        chartData: _generateChartData(2760, 2790, 50),
      ),
    ];
  }

  // Generate mock favorite stocks
  static List<Stock> getMockFavoriteStocks() {
    return [
      Stock(
        code: '600519',
        name: 'Kweichow Moutai',
        current: 1856.50,
        change: 23.40,
        changePercent: 1.28,
        open: 1833.10,
        high: 1862.30,
        low: 1828.50,
        volume: '1.2M',
        turnoverRate: 0.15,
        pe: 35.6,
        pb: 12.3,
        isFavorite: true,
      ),
      Stock(
        code: '000858',
        name: 'Wuliangye Yibin',
        current: 178.45,
        change: -2.35,
        changePercent: -1.30,
        open: 180.80,
        high: 182.15,
        low: 177.90,
        volume: '8.5M',
        turnoverRate: 0.68,
        pe: 28.9,
        pb: 8.7,
        isFavorite: true,
      ),
      Stock(
        code: '600036',
        name: 'China Merchants Bank',
        current: 38.67,
        change: 0.45,
        changePercent: 1.18,
        open: 38.22,
        high: 38.89,
        low: 38.15,
        volume: '45.2M',
        turnoverRate: 1.82,
        pe: 6.8,
        pb: 1.2,
        isFavorite: true,
      ),
      Stock(
        code: '000333',
        name: 'Midea Group',
        current: 68.34,
        change: 1.23,
        changePercent: 1.83,
        open: 67.11,
        high: 68.78,
        low: 66.90,
        volume: '28.9M',
        turnoverRate: 0.65,
        pe: 15.2,
        pb: 4.5,
        isFavorite: true,
      ),
      Stock(
        code: '002475',
        name: 'Luxshare Precision',
        current: 34.56,
        change: -0.78,
        changePercent: -2.21,
        open: 35.34,
        high: 35.67,
        low: 34.23,
        volume: '52.3M',
        turnoverRate: 2.15,
        pe: 22.3,
        pb: 6.1,
        isFavorite: true,
      ),
    ];
  }

  // Generate mock hot sectors
  static List<Map<String, dynamic>> getMockHotSectors() {
    return [
      {
        'name': 'Artificial Intelligence',
        'change': 3.45,
        'leadingStock': 'iFlytek',
        'stockCode': '002230',
        'icon': '🤖',
      },
      {
        'name': 'New Energy Vehicles',
        'change': 2.78,
        'leadingStock': 'BYD',
        'stockCode': '002594',
        'icon': '🚗',
      },
      {
        'name': 'Semiconductors',
        'change': -1.23,
        'leadingStock': 'SMIC',
        'stockCode': '688981',
        'icon': '💾',
      },
      {
        'name': 'Healthcare',
        'change': 1.56,
        'leadingStock': 'WuXi AppTec',
        'stockCode': '603259',
        'icon': '💊',
      },
    ];
  }

  // Generate mock AI recommendations
  static List<Map<String, dynamic>> getMockAIRecommendations() {
    return [
      {
        'code': '300750',
        'name': 'Contemporary Amperex',
        'reason': 'Strong earnings growth, expanding market share in EV batteries',
        'score': 92,
        'tags': ['Growth', 'Tech'],
      },
      {
        'code': '603259',
        'name': 'WuXi AppTec',
        'reason': 'Undervalued biotech leader with solid fundamentals',
        'score': 88,
        'tags': ['Value', 'Healthcare'],
      },
      {
        'code': '688981',
        'name': 'SMIC',
        'reason': 'Semiconductor sector leader with government support',
        'score': 85,
        'tags': ['Growth', 'Strategic'],
      },
    ];
  }

  // Generate mock news
  static List<Map<String, dynamic>> getMockNews() {
    return [
      {
        'title': 'Central Bank announces new monetary policy measures',
        'source': 'Securities Daily',
        'time': '10 mins ago',
        'type': 'important',
      },
      {
        'title': 'Tech sector leads market rally on AI enthusiasm',
        'source': 'China Securities Journal',
        'time': '25 mins ago',
        'type': 'market',
      },
      {
        'title': 'Kweichow Moutai reports strong quarterly earnings',
        'source': 'Company Announcement',
        'time': '1 hour ago',
        'type': 'company',
      },
      {
        'title': 'Foreign investors increase holdings in A-shares',
        'source': 'Shanghai Securities News',
        'time': '2 hours ago',
        'type': 'flow',
      },
    ];
  }

  // Helper: Generate chart data
  static List<double> _generateChartData(double start, double end, int count) {
    final List<double> data = [];
    final step = (end - start) / count;
    double current = start;
    
    for (int i = 0; i < count; i++) {
      current += step + (_random.nextDouble() - 0.5) * step * 0.5;
      data.add(current);
    }
    
    return data;
  }
}

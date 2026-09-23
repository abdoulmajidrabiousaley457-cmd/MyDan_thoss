import 'dart:math';

/// A concrete, executable stock **action plan** (a.k.a. trading plan) used as a
/// worked example inside the tools.
class ActionPlan {
  final String symbol;
  final String company;
  final String market;

  /// Current market price.
  final double price;

  /// Recommended entry price (limit order).
  final double entry;

  /// Profit target.
  final double target;

  /// Risk-control stop loss.
  final double stopLoss;

  /// Analyst / AI recommendation score in [0, 100].
  final int score;

  /// Recommendation key: 'buy' | 'hold' | 'sell'.
  final String signal;

  /// Risk label key: 'low' | 'medium' | 'high'.
  final String risk;

  /// Time horizon key: 'short' | 'medium' | 'long'.
  final String horizon;

  /// Historic close prices (most recent last) used to draw the chart.
  final List<double> history;

  const ActionPlan({
    required this.symbol,
    required this.company,
    required this.market,
    required this.price,
    required this.entry,
    required this.target,
    required this.stopLoss,
    required this.score,
    required this.signal,
    required this.risk,
    required this.horizon,
    required this.history,
  });

  /// Expected gain from entry to target, in %.
  double get upside => ((target - entry) / entry) * 100;

  /// Expected loss from entry to stop, in %.
  double get downside => ((entry - stopLoss) / entry) * 100;

  /// Reward / risk ratio.
  double get rewardRisk => downside == 0 ? 0 : upside / downside;

  /// Gain from current price to target, in %.
  double get potentialFromPrice => ((target - price) / price) * 100;
}

/// Reference **example action plans** used across the tools.
///
/// Three plans covering a growth, a value and a dividend profile so every tool
/// can showcase a realistic "plan d'action".
class ActionPlanService {
  static const List<ActionPlan> plans = [
    ActionPlan(
      symbol: 'NVDA',
      company: 'NVIDIA Corporation',
      market: 'NASDAQ',
      price: 118.40,
      entry: 115.00,
      target: 148.00,
      stopLoss: 104.00,
      score: 91,
      signal: 'buy',
      risk: 'medium',
      horizon: 'medium',
      history: [
        96.2,
        98.1,
        97.4,
        101.3,
        103.8,
        102.1,
        105.6,
        108.9,
        107.2,
        110.4,
        112.8,
        111.5,
        114.2,
        116.9,
        115.3,
        117.8,
        119.6,
        118.1,
        117.2,
        118.4,
      ],
    ),
    ActionPlan(
      symbol: 'AAPL',
      company: 'Apple Inc.',
      market: 'NASDAQ',
      price: 214.75,
      entry: 210.00,
      target: 245.00,
      stopLoss: 196.00,
      score: 78,
      signal: 'hold',
      risk: 'low',
      horizon: 'long',
      history: [
        188.4,
        190.2,
        192.6,
        191.1,
        194.8,
        196.3,
        199.0,
        197.5,
        201.2,
        203.6,
        202.4,
        205.8,
        208.1,
        206.9,
        210.3,
        212.7,
        211.4,
        213.8,
        215.2,
        214.75,
      ],
    ),
    ActionPlan(
      symbol: 'XOM',
      company: 'Exxon Mobil Corporation',
      market: 'NYSE',
      price: 112.30,
      entry: 108.00,
      target: 128.00,
      stopLoss: 99.50,
      score: 68,
      signal: 'buy',
      risk: 'medium',
      horizon: 'short',
      history: [
        99.4,
        100.8,
        102.1,
        101.3,
        103.7,
        105.2,
        104.6,
        106.9,
        108.4,
        107.1,
        109.6,
        111.2,
        110.4,
        112.8,
        114.1,
        113.2,
        115.6,
        114.3,
        113.1,
        112.3,
      ],
    ),
    ActionPlan(
      symbol: 'TSLA',
      company: 'Tesla, Inc.',
      market: 'NASDAQ',
      price: 248.60,
      entry: 240.00,
      target: 305.00,
      stopLoss: 212.00,
      score: 74,
      signal: 'buy',
      risk: 'high',
      horizon: 'short',
      history: [
        210.5,
        218.2,
        214.9,
        222.6,
        229.1,
        225.4,
        233.8,
        238.2,
        234.6,
        242.1,
        247.3,
        243.8,
        251.2,
        256.4,
        252.1,
        259.8,
        255.3,
        250.7,
        246.2,
        248.6,
      ],
    ),
    ActionPlan(
      symbol: 'KO',
      company: 'The Coca-Cola Company',
      market: 'NYSE',
      price: 63.85,
      entry: 62.00,
      target: 72.00,
      stopLoss: 57.50,
      score: 72,
      signal: 'hold',
      risk: 'low',
      horizon: 'long',
      history: [
        58.2,
        58.9,
        59.4,
        59.1,
        60.2,
        60.8,
        60.4,
        61.3,
        61.9,
        61.5,
        62.4,
        62.9,
        62.6,
        63.3,
        63.9,
        63.4,
        64.1,
        63.7,
        63.2,
        63.85,
      ],
    ),
    ActionPlan(
      symbol: 'AMD',
      company: 'Advanced Micro Devices',
      market: 'NASDAQ',
      price: 156.20,
      entry: 150.00,
      target: 189.00,
      stopLoss: 133.00,
      score: 83,
      signal: 'buy',
      risk: 'high',
      horizon: 'medium',
      history: [
        128.4,
        133.2,
        130.9,
        137.6,
        142.1,
        139.4,
        145.8,
        150.2,
        147.6,
        152.1,
        156.3,
        153.8,
        159.2,
        162.4,
        158.7,
        163.9,
        160.3,
        157.1,
        154.8,
        156.2,
      ],
    ),
  ];

  /// Returns a small, realistic example for the "quick plan" widgets.
  static ActionPlan get featured => plans.first;

  /// Simulates a projected price path from [from] to [to] over [steps] points.
  static List<double> projectPath(double from, double to, {int steps = 12}) {
    final rnd = Random(from.hashCode ^ to.hashCode);
    final path = <double>[];
    for (int i = 0; i <= steps; i++) {
      final t = i / steps;
      final base = from + (to - from) * t;
      final noise = (rnd.nextDouble() - 0.5) * (to - from).abs() * 0.12;
      path.add(base + (i == 0 || i == steps ? 0 : noise));
    }
    return path;
  }
}

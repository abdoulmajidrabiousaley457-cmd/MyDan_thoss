import 'dart:math';

/// A single tracking entry (portfolio / strategy performance snapshot).
class TrackingEntry {
  final String label;
  final double value;
  final double benchmarkValue;
  final DateTime date;

  const TrackingEntry({
    required this.label,
    required this.value,
    required this.benchmarkValue,
    required this.date,
  });
}

/// Aggregated evaluation of a tracking series.
class EvaluationResult {
  final double totalReturn; // %
  final double benchmarkReturn; // %
  final double alpha; // relative performance vs benchmark (%)
  final double winRate; // %
  final double sharpe;
  final double maxDrawdown; // % (positive number)
  final double volatility; // %
  final double rating; // 0..100
  final int wins;
  final int losses;

  const EvaluationResult({
    required this.totalReturn,
    required this.benchmarkReturn,
    required this.alpha,
    required this.winRate,
    required this.sharpe,
    required this.maxDrawdown,
    required this.volatility,
    required this.rating,
    required this.wins,
    required this.losses,
  });

  bool get outperforming => alpha >= 0;
}

/// Tracking & evaluation service.
///
/// Provides performance metrics and a composite evaluation rating for a
/// series of tracking entries.
class TrackingService {
  /// Computes the [EvaluationResult] for a series of monthly values.
  static EvaluationResult evaluate(List<TrackingEntry> entries) {
    if (entries.length < 2) {
      return const EvaluationResult(
        totalReturn: 0,
        benchmarkReturn: 0,
        alpha: 0,
        winRate: 0,
        sharpe: 0,
        maxDrawdown: 0,
        volatility: 0,
        rating: 0,
        wins: 0,
        losses: 0,
      );
    }

    final values = entries.map((e) => e.value).toList();
    final benchValues = entries.map((e) => e.benchmarkValue).toList();

    // Returns of each period.
    final returns = <double>[];
    for (int i = 1; i < values.length; i++) {
      returns.add((values[i] - values[i - 1]) / values[i - 1]);
    }

    final first = values.first;
    final last = values.last;
    final totalReturn = ((last - first) / first) * 100;

    final benchFirst = benchValues.first;
    final benchLast = benchValues.last;
    final benchmarkReturn = ((benchLast - benchFirst) / benchFirst) * 100;

    // Win rate.
    final wins = returns.where((r) => r > 0).length;
    final losses = returns.where((r) => r < 0).length;
    final winRate = returns.isEmpty ? 0.0 : (wins / returns.length) * 100;

    // Volatility (std. deviation of periodic returns).
    final meanRet = returns.isEmpty
        ? 0.0
        : returns.reduce((a, b) => a + b) / returns.length;
    final variance = returns.length > 1
        ? returns
                  .map((r) => pow(r - meanRet, 2).toDouble())
                  .reduce((a, b) => a + b) /
              (returns.length - 1)
        : 0.0;
    final stdDev = sqrt(variance);
    final volatility = stdDev * sqrt(12) * 100; // annualised

    // Sharpe ratio (risk-free ≈ 2%).
    const riskFree = 0.02;
    final annualReturn =
        (pow((last / first), 12 / (values.length - 1)).toDouble()) - 1;
    final sharpe = stdDev == 0
        ? 0.0
        : (annualReturn - riskFree) / (stdDev * sqrt(12));

    // Max drawdown.
    double peak = values.first;
    double maxDd = 0;
    for (final v in values) {
      if (v > peak) peak = v;
      final dd = (peak - v) / peak;
      if (dd > maxDd) maxDd = dd;
    }
    final maxDrawdown = maxDd * 100;

    // Composite rating (0..100) combining return, win rate, sharpe and dd.
    final returnScore = totalReturn.clamp(-50, 100) / 100 * 35;
    final winScore = (winRate / 100) * 25;
    final sharpeScore = sharpe.clamp(-2, 4) / 4 * 25;
    final ddScore = (1 - maxDrawdown.clamp(0, 50) / 50) * 15;
    final rating = (returnScore + winScore + sharpeScore + ddScore)
        .clamp(0, 100)
        .toDouble();

    return EvaluationResult(
      totalReturn: totalReturn,
      benchmarkReturn: benchmarkReturn,
      alpha: totalReturn - benchmarkReturn,
      winRate: winRate,
      sharpe: sharpe,
      maxDrawdown: maxDrawdown,
      volatility: volatility,
      rating: rating,
      wins: wins,
      losses: losses,
    );
  }

  /// Realistic sample tracking history (12 months) for demonstration.
  static List<TrackingEntry> sampleHistory() {
    const portfolio = [
      100000,
      102500,
      101200,
      104800,
      108300,
      107100,
      111500,
      115200,
      113900,
      118600,
      123400,
      129800,
    ];
    const benchmark = [
      100000,
      101300,
      100800,
      102100,
      103400,
      102900,
      104200,
      105600,
      105100,
      106800,
      108200,
      109500,
    ];
    final now = DateTime.now();
    return List.generate(12, (i) {
      final month = DateTime(now.year, now.month - (11 - i));
      return TrackingEntry(
        label: '${month.year}-${month.month.toString().padLeft(2, '0')}',
        value: portfolio[i].toDouble(),
        benchmarkValue: benchmark[i].toDouble(),
        date: month,
      );
    });
  }
}

import 'dart:math';

/// Comprehensive statistics for a numeric dataset.
class DataStatistics {
  final List<double> data;
  final double mean;
  final double median;
  final double stdDev;
  final double variance;
  final double min;
  final double max;
  final double range;
  final double sum;
  final int count;
  final List<double> sorted;

  const DataStatistics({
    required this.data,
    required this.mean,
    required this.median,
    required this.stdDev,
    required this.variance,
    required this.min,
    required this.max,
    required this.range,
    required this.sum,
    required this.count,
    required this.sorted,
  });

  /// Simple linear-regression slope to describe the dataset trend.
  double get slope {
    if (data.length < 2) return 0;
    final n = data.length;
    final meanX = (n - 1) / 2;
    double num = 0;
    double den = 0;
    for (int i = 0; i < n; i++) {
      num += (i - meanX) * (data[i] - mean);
      den += pow(i - meanX, 2).toDouble();
    }
    return den == 0 ? 0 : num / den;
  }

  /// Normalised strength of the trend in the range [-1, 1].
  double get trendStrength {
    if (max == min) return 0;
    final normalised = slope * (count - 1);
    return (normalised / (max - min)).clamp(-1.0, 1.0);
  }

  /// Coefficient of variation (relative dispersion).
  double get coefficientOfVariation => mean == 0 ? 0 : (stdDev / mean.abs()) * 100;

  /// Outliers detected with the 1.5 * IQR rule.
  List<double> get outliers {
    if (data.length < 4) return const [];
    final q1 = _percentile(sorted, 0.25);
    final q3 = _percentile(sorted, 0.75);
    final iqr = q3 - q1;
    final lower = q1 - 1.5 * iqr;
    final upper = q3 + 1.5 * iqr;
    return data.where((v) => v < lower || v > upper).toList();
  }

  static double _percentile(List<double> sortedData, double p) {
    if (sortedData.isEmpty) return 0;
    final rank = p * (sortedData.length - 1);
    final lower = rank.floor();
    final upper = rank.ceil();
    if (lower == upper) return sortedData[lower];
    final weight = rank - lower;
    return sortedData[lower] * (1 - weight) + sortedData[upper] * weight;
  }
}

/// Statistical analysis helpers for the Data Analysis Suite.
class DataAnalysisService {
  /// Parses a free-form string of comma / space / semicolon separated numbers.
  static List<double> parse(String input) {
    return input
        .split(RegExp(r'[,;\s]+'))
        .map((e) => e.trim())
        .where((e) => e.isNotEmpty)
        .map((e) => double.tryParse(e.replaceAll(',', '.')))
        .whereType<double>()
        .toList();
  }

  /// Computes the full [DataStatistics] for a dataset.
  static DataStatistics analyze(List<double> data) {
    if (data.isEmpty) {
      return const DataStatistics(
        data: [],
        mean: 0,
        median: 0,
        stdDev: 0,
        variance: 0,
        min: 0,
        max: 0,
        range: 0,
        sum: 0,
        count: 0,
        sorted: [],
      );
    }

    final sorted = [...data]..sort();
    final n = data.length;
    final sum = data.reduce((a, b) => a + b);
    final mean = sum / n;
    final variance = n > 1
        ? data.map((v) => pow(v - mean, 2).toDouble()).reduce((a, b) => a + b) / (n - 1)
        : 0.0;
    final stdDev = sqrt(variance);
    final minV = sorted.first;
    final maxV = sorted.last;

    double median;
    if (n.isOdd) {
      median = sorted[n ~/ 2];
    } else {
      median = (sorted[n ~/ 2 - 1] + sorted[n ~/ 2]) / 2;
    }

    return DataStatistics(
      data: data,
      mean: mean,
      median: median,
      stdDev: stdDev,
      variance: variance,
      min: minV,
      max: maxV,
      range: maxV - minV,
      sum: sum,
      count: n,
      sorted: sorted,
    );
  }

  /// A realistic sample dataset for demonstration.
  static const List<double> sampleData = [
    120, 125, 118, 130, 128, 135, 140, 138, 145, 150,
    148, 155, 160, 158, 165, 172, 168, 175, 182, 190,
    210, 185, 178, 188, 195, 200, 198, 205, 215, 220,
  ];
}
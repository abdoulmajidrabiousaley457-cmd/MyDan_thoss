/// Stock Market Index Model
class StockIndex {
  final String name;
  final String code;
  final double current;
  final double change;
  final double changePercent;
  final double open;
  final double high;
  final double low;
  final String volume;
  final List<double> chartData;

  StockIndex({
    required this.name,
    required this.code,
    required this.current,
    required this.change,
    required this.changePercent,
    required this.open,
    required this.high,
    required this.low,
    required this.volume,
    required this.chartData,
  });

  bool get isUp => change >= 0;
}

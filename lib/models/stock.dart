/// Stock Model
class Stock {
  final String code;
  final String name;
  final double current;
  final double change;
  final double changePercent;
  final double open;
  final double high;
  final double low;
  final String volume;
  final double turnoverRate;
  final double pe;
  final double pb;
  final bool isFavorite;

  Stock({
    required this.code,
    required this.name,
    required this.current,
    required this.change,
    required this.changePercent,
    required this.open,
    required this.high,
    required this.low,
    required this.volume,
    required this.turnoverRate,
    required this.pe,
    required this.pb,
    this.isFavorite = false,
  });

  bool get isUp => change >= 0;

  Stock copyWith({
    String? code,
    String? name,
    double? current,
    double? change,
    double? changePercent,
    double? open,
    double? high,
    double? low,
    String? volume,
    double? turnoverRate,
    double? pe,
    double? pb,
    bool? isFavorite,
  }) {
    return Stock(
      code: code ?? this.code,
      name: name ?? this.name,
      current: current ?? this.current,
      change: change ?? this.change,
      changePercent: changePercent ?? this.changePercent,
      open: open ?? this.open,
      high: high ?? this.high,
      low: low ?? this.low,
      volume: volume ?? this.volume,
      turnoverRate: turnoverRate ?? this.turnoverRate,
      pe: pe ?? this.pe,
      pb: pb ?? this.pb,
      isFavorite: isFavorite ?? this.isFavorite,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../l10n/app_strings.dart';
import '../../services/book_library_service.dart';
import '../../theme/app_colors.dart';
import '../../widgets/app_logo.dart';
import '../../widgets/tool_logo.dart';

/// In-app Library — a searchable, downloadable catalogue of free PDF books.
class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});

  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _category = 'all';

  static const List<String> _categories = [
    'all',
    'invest',
    'analysis',
    'ai',
    'mindset',
  ];

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  String _catLabel(String c, AppStrings t) => switch (c) {
    'invest' => t['libraryCatInvest'],
    'analysis' => t['libraryCatAnalysis'],
    'ai' => t['libraryCatAI'],
    'mindset' => t['libraryCatMindset'],
    _ => t['libraryCatAll'],
  };

  List<BookItem> get _filtered {
    final byCat = BookLibraryService.byCategory(_category);
    final q = _searchCtrl.text.trim().toLowerCase();
    if (q.isEmpty) return byCat;
    return byCat
        .where(
          (b) =>
              b.title.toLowerCase().contains(q) ||
              b.author.toLowerCase().contains(q),
        )
        .toList();
  }

  Future<void> _open(BuildContext context, String url, String label) async {
    try {
      final ok = await launchUrl(
        Uri.parse(url),
        mode: LaunchMode.externalApplication,
      );
      if (!ok && context.mounted) _snack(context, url);
    } catch (_) {
      if (context.mounted) _snack(context, url);
    }
  }

  void _snack(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: AppColors.backgroundElevated,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = context.tr;
    final books = _filtered;

    return Scaffold(
      backgroundColor: AppColors.backgroundPrimary,
      appBar: AppBar(
        title: AppBarTitle(
          t['libraryTitle'],
          logoAsset: ToolLogos.library,
          logoFallbackIcon: Icons.library_books_outlined,
          logoGradient: AppColors.toolIndigo,
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(context, t),
            _buildCategoryChips(context, t),
            Expanded(
              child: books.isEmpty
                  ? _buildEmpty(context, t)
                  : ListView.builder(
                      padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                      itemCount: books.length,
                      itemBuilder: (context, i) =>
                          _buildBookCard(context, t, books[i]),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, AppStrings t) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 18),
      decoration: BoxDecoration(gradient: AppColors.greenGradient),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(9),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(11),
                ),
                child: const Icon(
                  Icons.menu_book,
                  color: Colors.white,
                  size: 20,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      t['libraryTitle'],
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      t['librarySubtitle'],
                      style: const TextStyle(
                        color: Colors.white70,
                        fontSize: 11.5,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${BookLibraryService.books.length} ${t['libraryBooks']}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _searchCtrl,
            onChanged: (_) => setState(() {}),
            style: const TextStyle(color: AppColors.textPrimary, fontSize: 14),
            decoration: InputDecoration(
              hintText: t['librarySearch'],
              prefixIcon: const Icon(Icons.search, size: 20),
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(vertical: 0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide.none,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChips(BuildContext context, AppStrings t) {
    return SizedBox(
      height: 52,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        itemCount: _categories.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, i) {
          final c = _categories[i];
          final selected = _category == c;
          return GestureDetector(
            onTap: () => setState(() => _category = c),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 160),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: selected
                    ? AppColors.greenPrimary
                    : AppColors.backgroundSecondary,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: selected
                      ? AppColors.greenPrimary
                      : AppColors.borderPrimary,
                ),
              ),
              child: Text(
                _catLabel(c, t),
                style: TextStyle(
                  color: selected ? Colors.white : AppColors.textSecondary,
                  fontSize: 12.5,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmpty(BuildContext context, AppStrings t) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.search_off, size: 48, color: AppColors.textTertiary),
          const SizedBox(height: 12),
          Text(
            t['libraryEmpty'],
            style: const TextStyle(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildBookCard(BuildContext context, AppStrings t, BookItem b) {
    final cover = _coverColors(b.accent);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.backgroundSecondary,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Generated cover
          Semantics(
            image: true,
            label: 'Cover of ${b.title}',
            child: Container(
              width: 58,
              height: 80,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: cover,
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(8),
                boxShadow: [
                  BoxShadow(
                    color: cover.first.withValues(alpha: 0.35),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.menu_book, color: Colors.white, size: 22),
                  const SizedBox(height: 4),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: Text(
                      b.title.split(' ').take(2).join(' '),
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 7.5,
                        fontWeight: FontWeight.bold,
                        height: 1.1,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  b.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  b.author,
                  style: const TextStyle(
                    color: AppColors.textTertiary,
                    fontSize: 11.5,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  b.description,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 11.5,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    _pill(
                      '${b.pages} ${t['libraryPages']}',
                      AppColors.greenPrimary,
                    ),
                    const SizedBox(width: 6),
                    _pill(_catLabel(b.category, t), AppColors.accentBlue),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () =>
                            _open(context, b.pdfUrl, t['libraryDownload']),
                        icon: const Icon(Icons.download, size: 16),
                        label: Text(
                          t['libraryDownload'],
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 11.5),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.greenPrimary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          minimumSize: const Size(0, 40),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton.icon(
                      onPressed: () =>
                          _open(context, b.pdfUrl, t['libraryOpen']),
                      icon: const Icon(Icons.open_in_new, size: 15),
                      label: Text(
                        t['libraryOpen'],
                        style: const TextStyle(fontSize: 11.5),
                      ),
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppColors.greenPrimary,
                        side: const BorderSide(color: AppColors.greenPrimary),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 10,
                        ),
                        minimumSize: const Size(0, 40),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _pill(String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 10,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  List<Color> _coverColors(int accent) {
    const sets = [
      [Color(0xFF16A34A), Color(0xFF065F46)],
      [Color(0xFF2563EB), Color(0xFF1E3A8A)],
      [Color(0xFF7C3AED), Color(0xFF4C1D95)],
      [Color(0xFFF59E0B), Color(0xFFB45309)],
      [Color(0xFF0891B2), Color(0xFF164E63)],
    ];
    return sets[accent % sets.length];
  }
}

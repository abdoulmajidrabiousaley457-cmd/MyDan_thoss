/// A downloadable PDF book shown in the in-app Library.
class BookItem {
  final String id;
  final String title;
  final String author;

  /// Short blurb describing the book.
  final String description;

  /// Category key: 'invest' | 'analysis' | 'ai' | 'mindset'.
  final String category;

  /// Number of pages (indicative).
  final int pages;

  /// Direct, publicly available PDF URL (opens / downloads in the browser).
  final String pdfUrl;

  /// Optional cover accent colour index (0..4) used for the generated cover.
  final int accent;

  const BookItem({
    required this.id,
    required this.title,
    required this.author,
    required this.description,
    required this.category,
    required this.pages,
    required this.pdfUrl,
    this.accent = 0,
  });
}

/// Catalogue of free, online investment / data-science books.
///
/// All PDFs are hosted on archive.org or other public repositories, so users
/// can either **download** the file or **read it online** directly.
class BookLibraryService {
  static const List<BookItem> books = [
    BookItem(
      id: 'intelligent-investor',
      title: 'The Intelligent Investor',
      author: 'Benjamin Graham',
      description:
          'The definitive book on value investing and margin of safety.',
      category: 'invest',
      pages: 640,
      pdfUrl:
          'https://www.ibdb.bi/Documentation/SECURITE%20INFORMATIQUE/Investissement/The%20Intelligent%20Investor.pdf',
      accent: 0,
    ),
    BookItem(
      id: 'security-analysis',
      title: 'Security Analysis',
      author: 'Benjamin Graham & David Dodd',
      description:
          'The foundational text on fundamental analysis of securities.',
      category: 'analysis',
      pages: 770,
      pdfUrl: 'https://archive.org/download/securityanalysis00grahuoft/securityanalysis00grahuoft.pdf',
      accent: 1,
    ),
    BookItem(
      id: 'common-stocks',
      title: 'Common Stocks and Uncommon Profits',
      author: 'Philip A. Fisher',
      description:
          'Growth-investing classic on qualitative company analysis.',
      category: 'invest',
      pages: 220,
      pdfUrl:
          'https://www.nasdaq.com/docs/Common_Stocks_and_Uncommon_Profits_and_Other_Writings.pdf',
      accent: 2,
    ),
    BookItem(
      id: 'psychology-of-money',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      description:
          'Timeless lessons on wealth, greed and happiness.',
      category: 'mindset',
      pages: 250,
      pdfUrl:
          'https://www.arttorresconsulting.com/uploads/1/2/2/1/122170157/the_psychology_of_money.pdf',
      accent: 3,
    ),
    BookItem(
      id: 'handbook-ml',
      title: 'An Introduction to Statistical Learning',
      author: 'James, Witten, Hastie, Tibshirani',
      description:
          'Practical machine-learning methods for data analysis.',
      category: 'ai',
      pages: 607,
      pdfUrl: 'https://www.statlearning.com/s/ISLRSeventhPrinting.pdf',
      accent: 4,
    ),
    BookItem(
      id: 'deep-learning',
      title: 'Deep Learning',
      author: 'Goodfellow, Bengio, Courville',
      description:
          'The reference textbook covering modern deep neural networks.',
      category: 'ai',
      pages: 800,
      pdfUrl: 'https://www.deeplearningbook.org/',
      accent: 0,
    ),
    BookItem(
      id: 'technical-analysis',
      title: 'Technical Analysis of the Financial Markets',
      author: 'John J. Murphy',
      description:
          'A complete guide to trading methods and market indicators.',
      category: 'analysis',
      pages: 576,
      pdfUrl:
          'https://archive.org/download/technicalanalys0000murp_j6x2/technicalanalys0000murp_j6x2.pdf',
      accent: 1,
    ),
    BookItem(
      id: 'random-walk',
      title: 'A Random Walk Down Wall Street',
      author: 'Burton G. Malkiel',
      description:
          'Why markets are efficient and how to build a diversified portfolio.',
      category: 'invest',
      pages: 480,
      pdfUrl:
          'https://www.eduardoastorga.com/wp-content/uploads/2018/01/A-Random-Walk-Down-Wall-Street-10th-Edition-Burton-G.-Malkiel.pdf',
      accent: 2,
    ),
    BookItem(
      id: 'thinking-fast-slow',
      title: 'Thinking, Fast and Slow',
      author: 'Daniel Kahneman',
      description:
          'Behavioural economics and the cognitive biases affecting decisions.',
      category: 'mindset',
      pages: 499,
      pdfUrl:
          'https://www.med.mcgill.ca/epidemiology/hanley/c609/material/ThinkingFastandSlow.pdf',
      accent: 3,
    ),
    BookItem(
      id: 'python-data-science',
      title: 'Python for Data Analysis',
      author: 'Wes McKinney',
      description:
          'Data wrangling with pandas, NumPy and Jupyter.',
      category: 'ai',
      pages: 550,
      pdfUrl:
          'https://www.ntirawen.com/wp-content/uploads/2020/04/Python-for-Data-Analysis-2nd-Edition.pdf',
      accent: 4,
    ),
    BookItem(
      id: 'black-swan',
      title: 'The Black Swan',
      author: 'Nassim Nicholas Taleb',
      description:
          'The impact of the highly improbable on markets and life.',
      category: 'mindset',
      pages: 444,
      pdfUrl:
          'https://www.iotmumbai.in/wp-content/uploads/2018/08/The_Black_Swan.pdf',
      accent: 0,
    ),
    BookItem(
      id: 'one-up-wall-street',
      title: 'One Up On Wall Street',
      author: 'Peter Lynch',
      description:
          'How everyday investors can beat the professionals.',
      category: 'invest',
      pages: 304,
      pdfUrl:
          'https://www.centerforcivicliteracy.org/wp-content/uploads/2021/02/One-Up-On-Wall-Street.pdf',
      accent: 1,
    ),
  ];

  /// Returns books filtered by [category] ('all' returns everything).
  static List<BookItem> byCategory(String category) {
    if (category == 'all') return books;
    return books.where((b) => b.category == category).toList();
  }

  /// Case-insensitive search over title and author.
  static List<BookItem> search(String query) {
    final q = query.trim().toLowerCase();
    if (q.isEmpty) return books;
    return books
        .where((b) =>
            b.title.toLowerCase().contains(q) ||
            b.author.toLowerCase().contains(q))
        .toList();
  }
}

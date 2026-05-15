

class SubscriptionPage extends StatelessWidget {
  final String subscriptionLink;

  const SubscriptionPage({super.key, required this.subscriptionLink});

  Future<void> _launchURL(BuildContext context) async {
    final uri = Uri.parse(subscriptionLink);
    try {
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        throw 'Could not launch $subscriptionLink';
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Could not open the link. Please check your browser.'),
            backgroundColor: Colors.redAccent,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F7),
      body: Stack(
        children: [
          // Background Decor
          Positioned(
            top: -100,
            right: -100,
            child: Container(
              width: 300,
              height: 300,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFF007AFF).withOpacity(0.05),
              ),
            ),
          ),
          Positioned(
            bottom: -50,
            left: -50,
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: const Color(0xFFAF52DE).withOpacity(0.05),
              ),
            ),
          ),
          
          SafeArea(
            child: Column(
              children: [
                // Custom Header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black, size: 20),
                        onPressed: () => Navigator.pop(context),
                      ),
                      Expanded(
                        child: Text(
                          'Choose Your Plan',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: Colors.black,
                            letterSpacing: -0.5,
                            fontFamily: 'XRXV',
                          ),
                        ),
                      ),
                      const SizedBox(width: 48), // Spacer for balance
                    ],
                  ),
                ),
                
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    child: Column(
                      children: [
                        _buildSubscriptionCard(
                          context,
                          title: 'WINGO STARTER',
                          subtitle: 'Best for Beginners',
                          price: '₹499',
                          period: '7 Days Access',
                          features: [
                            'Basic Market Insights',
                            'Live Trend Tracking',
                            'Starter Signal Pack'
                          ],
                          gradient: const [Color(0xFF007AFF), Color(0xFF00C6FF)],
                        ),

                        const SizedBox(height: 20),

                        _buildSubscriptionCard(
                          context,
                          title: 'WINGO ELITE',
                          subtitle: 'Most Popular Choice',
                          price: '₹1499',
                          period: '30 Days Access',
                          features: [
                            'Advanced Pattern Analysis',
                            'High Accuracy Signals',
                            'VIP Community Access',
                            'Priority Support'
                          ],
                          gradient: const [Color(0xFFAF52DE), Color(0xFF6E56FF)],
                          isFeatured: true,
                        ),

                        const SizedBox(height: 20),

                        _buildSubscriptionCard(
                          context,
                          title: 'WINGO MAX PRO',
                          subtitle: 'Ultimate Lifetime Power',
                          price: '₹2999',
                          period: 'Lifetime Access',
                          features: [
                            'Full AI Prediction Engine',
                            'Neural-Based Smart Signals',
                            'Unlimited Premium Access',
                            '24/7 Dedicated Support'
                          ],
                          gradient: const [Color(0xFF34C759), Color(0xFF2EBD59)],
                        ),

                        const SizedBox(height: 30),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubscriptionCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required String price,
    required String period,
    required List<String> features,
    required List<Color> gradient,
    bool isFeatured = false,
  }) {
    return Container(
      width: double.infinity,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: gradient[0].withOpacity(0.12),
            blurRadius: 25,
            offset: const Offset(0, 12),
          ),
        ],
        border: isFeatured ? Border.all(color: gradient[0].withOpacity(0.3), width: 1.5) : null,
      ),
      child: Stack(
        children: [
          Positioned(
            top: -40,
            right: -40,
            child: SizedBox(
              width: 160,
              height: 160,
              child: CustomPaint(painter: CardBlobPainter(gradient[0].withOpacity(0.06))),
            ),
          ),
          Positioned(
            bottom: 60,
            left: -30,
            child: SizedBox(
              width: 130,
              height: 130,
              child: CustomPaint(painter: CardBlobPainter(gradient[1].withOpacity(0.04))),
            ),
          ),
          Column(
            children: [
          // Header with Title & Price
          Container(
            padding: const EdgeInsets.all(25),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        color: gradient[0],
                        letterSpacing: 1.2,
                        fontFamily: 'XRXV',
                      ),
                    ),
                    if (isFeatured)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: gradient[0].withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          'RECOMMENDED',
                          style: TextStyle(
                            color: gradient[0],
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            fontFamily: 'XRXV',
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Colors.black.withOpacity(0.5),
                    fontFamily: 'XRXV',
                  ),
                ),
                const SizedBox(height: 15),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      price,
                      style: TextStyle(
                        fontSize: 36,
                        fontWeight: FontWeight.w900,
                        color: Colors.black,
                        fontFamily: 'XRXV',
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      '/ $period',
                      style: TextStyle(
                        fontSize: 15,
                        color: Colors.black.withOpacity(0.4),
                        fontWeight: FontWeight.w600,
                        fontFamily: 'XRXV',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // Divider
          Container(
            height: 1,
            margin: const EdgeInsets.symmetric(horizontal: 25),
            color: Colors.black.withOpacity(0.05),
          ),
          
          // Features
          Padding(
            padding: const EdgeInsets.all(25),
            child: Column(
              children: [
                ...features.map((f) => Padding(
                      padding: const EdgeInsets.only(bottom: 15),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: gradient[0].withOpacity(0.1),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(Icons.check, color: gradient[0], size: 14),
                          ),
                          const SizedBox(width: 15),
                          Text(
                            f,
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.black.withOpacity(0.7),
                              fontWeight: FontWeight.w600,
                              fontFamily: 'XRXV',
                            ),
                          ),
                        ],
                      ),
                    )),
                const SizedBox(height: 15),
                
                // Action Button
                Container(
                  width: double.infinity,
                  height: 60,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(18),
                    gradient: LinearGradient(
                      colors: gradient,
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: gradient[0].withOpacity(0.3),
                        blurRadius: 15,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: ElevatedButton(
                    onPressed: () => _launchURL(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      foregroundColor: Colors.white,
                      shadowColor: Colors.transparent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                    child: Text(
                      'UPGRADE NOW',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1,
                        fontFamily: 'XRXV',
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      ],
      ),
    );
  }
}

class CardBlobPainter extends CustomPainter {
  final Color color;
  CardBlobPainter(this.color);
  
  @override
  void paint(Canvas canvas, Size size) {
    var paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;
    var path = Path();
    path.moveTo(size.width * 0.2, size.height * 0.3);
    path.quadraticBezierTo(size.width * 0.5, size.height * -0.1, size.width * 0.8, size.height * 0.2);
    path.quadraticBezierTo(size.width * 1.1, size.height * 0.5, size.width * 0.8, size.height * 0.8);
    path.quadraticBezierTo(size.width * 0.5, size.height * 1.1, size.width * 0.2, size.height * 0.8);
    path.quadraticBezierTo(size.width * -0.1, size.height * 0.5, size.width * 0.2, size.height * 0.3);
    canvas.drawPath(path, paint);
  }
  
  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

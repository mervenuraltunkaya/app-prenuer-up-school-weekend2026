import 'package:flutter/material.dart';
import 'package:smart_scan/core/constants/app_colors.dart';
import 'package:smart_scan/core/constants/app_radius.dart';
import 'package:smart_scan/core/constants/app_spacing.dart';

class SkeletonLoadingWidget extends StatefulWidget {
  const SkeletonLoadingWidget({super.key});

  @override
  State<SkeletonLoadingWidget> createState() => _SkeletonLoadingWidgetState();
}

class _SkeletonLoadingWidgetState extends State<SkeletonLoadingWidget>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1200),
  )..repeat();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (_, __) {
        final t = _controller.value;
        return Column(
          children: [
            _line(0.9, t),
            const SizedBox(height: AppSpacing.sm),
            _line(0.7, t),
            const SizedBox(height: AppSpacing.sm),
            _line(0.55, t),
          ],
        );
      },
    );
  }

  Widget _line(double widthFactor, double t) {
    final base = AppColors.mint;
    final highlight = Color.lerp(base, AppColors.pureWhite, 0.55 + (0.35 * t))!;
    return FractionallySizedBox(
      widthFactor: widthFactor,
      child: Container(
        height: 14,
        decoration: BoxDecoration(
          color: highlight,
          borderRadius: BorderRadius.circular(AppRadius.md),
        ),
      ),
    );
  }
}

import { StyleSheet } from 'react-native';
import { Colors, Sizes } from '../constants';

/**
 * Minimal luxury global styles
 */
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Sizes.lg,
    marginVertical: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    fontSize: Sizes.fontSize.md,
    color: Colors.text,
    fontWeight: '400',
    letterSpacing: -0.2,
  },
  textSecondary: {
    fontSize: Sizes.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  heading: {
    fontSize: Sizes.fontSize.xl,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.lg,
    paddingHorizontal: Sizes.xl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Sizes.fontSize.md,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});


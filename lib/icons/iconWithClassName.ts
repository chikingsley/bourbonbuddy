import { cssInterop } from 'nativewind';

export function iconWithClassName(icon: React.ComponentType<any>) {
  cssInterop(icon, {
    className: {
      target: 'style',
      nativeStyleToProp: { color: true, opacity: true },
    },
  });
}

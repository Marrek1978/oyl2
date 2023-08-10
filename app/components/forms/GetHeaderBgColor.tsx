import { useTheme } from '~/styles/ThemeContext';

export default function GetHeaderBgColor() {

  const { theme } = useTheme();
  const isDark = theme === 'night'; 

  const backgroundColor = isDark ? 'bg-base-300' : 'bg-base-content'

  return backgroundColor
}

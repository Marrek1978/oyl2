import { useTheme } from '~/styles/ThemeContext';

export  function GetHeaderBgColor() {
  const { theme } = useTheme();
  const isDark = theme === 'night'; 
  const backgroundColor = isDark ? 'bg-info-content' : 'bg-base-content'

  return backgroundColor
}


export function GetSpecialLinkColor() {

  const { theme } = useTheme();
  const isDark = theme === 'night'; 

  const LinkColor = isDark ? 'text-primary-content' : 'text-primary'
  console.log('isDark', isDark)

  return LinkColor
}

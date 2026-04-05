import { ActionIcon } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';

import { useAppTheme } from '../../../app/providers/theme-context';
import styles from './theme-toggle.module.scss';

const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useAppTheme();

  return (
    <ActionIcon
      variant="subtle"
      size={42}
      onClick={toggleColorScheme}
      aria-label="Переключить тему"
      className={styles.toggle}
    >
      {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
    </ActionIcon>
  );
};

export default ThemeToggle;
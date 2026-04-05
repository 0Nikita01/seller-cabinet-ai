import { type ReactNode } from 'react';

import ThemeToggle from '../theme-toggle/theme-toggle';

import styles from './page-layout.module.scss';

type PageLayoutProps = {
  children: ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className={styles.pageBackground}>
      <div className={styles.pageContent}>
        <div className={styles.themeToggle}>
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;

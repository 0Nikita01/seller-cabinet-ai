import { type ReactNode } from 'react';

import styles from './page-layout.module.scss';

type PageLayoutProps = {
  children: ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className={styles.pageBackground}>
      <div className={styles.pageContent}>{children}</div>
    </div>
  );
};

export default PageLayout;

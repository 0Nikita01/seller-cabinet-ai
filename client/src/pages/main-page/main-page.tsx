import { Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import PageLayout from '../../shared/ui/page-layout/page-layout';

import styles from './main-page.module.scss';

const MainPage = () => {
  return (
    <PageLayout>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.overlay}>
            <div className={styles.content}>
              <h1 className={styles.title}>Тестовое задание на стажировку в Авито</h1>

              <Link to="/ads" className={styles.link}>
                <Button size="md" radius="md" variant="filled" color="orange">
                  Перейти к объявлениям
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
};

export default MainPage;

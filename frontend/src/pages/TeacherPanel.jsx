import React from 'react';

const TeacherPanel = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Teacher Panel</h1>
        <p style={styles.subtitle}>Create courses, manage students and grade submissions.</p>
      </header>

      <main style={styles.main}>
        <section style={styles.card}>
          <h2 style={styles.h2}>Create a new course</h2>
          <p>Placeholder UI: create course form goes here.</p>
          <button style={styles.primaryBtn}>Create course</button>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>Manage enrollments</h2>
          <p>Placeholder for enrollment list, approvals, and messaging.</p>
        </section>

        <section style={styles.card}>
          <h2 style={styles.h2}>Grade submissions</h2>
          <p>Placeholder for assignment queue and grading UI.</p>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: { padding: 24 },
  header: { marginBottom: 12 },
  title: { margin: 0 },
  subtitle: { marginTop: 6, color: '#4b5563' },
  main: { display: 'grid', gap: 12 },
  card: {
    padding: 16,
    borderRadius: 8,
    boxShadow: '0 6px 18px rgba(0,0,0,0.04)',
    background: '#fff'
  },
  h2: { marginTop: 0 },
  primaryBtn: {
    padding: '10px 12px',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  }
};

export default TeacherPanel;

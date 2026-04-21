import { getPool } from '../api/lib/db.js';

async function init() {
  const pool = getPool();
  try {
    console.log('Creating tables...');

    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Books table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(100) NOT NULL,
        category VARCHAR(50),
        available BOOLEAN DEFAULT TRUE,
        img_url TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Loans table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS loans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        book_id INTEGER REFERENCES books(id),
        loan_date DATE DEFAULT CURRENT_DATE,
        due_date DATE NOT NULL,
        returned BOOLEAN DEFAULT FALSE
      );
    `);

    // Saved items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS saved_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        item_type VARCHAR(50),
        title VARCHAR(255) NOT NULL,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        book_id INTEGER REFERENCES books(id),
        status VARCHAR(20) DEFAULT 'pending',
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Activities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS library_activities (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(50),
        icon_bg VARCHAR(50),
        icon_color VARCHAR(50),
        message TEXT NOT NULL,
        meta VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created successfully.');

    // Seed data
    console.log('Seeding users...');
    await pool.query('TRUNCATE users RESTART IDENTITY CASCADE');
    await pool.query(`
      INSERT INTO users (user_id, name, role, password_hash, details) VALUES
      ('21HS402', 'Aisha Khan', 'student', 'password123', 'M.A. History, Year 2'),
      ('LIB-01', 'Dr. A. Rahman', 'librarian', 'password123', 'Chief Librarian'),
      ('GP5008', 'Harsh', 'student', 'harsh123', 'B.Tech Student, Year 3'),
      ('LIB', 'Main Librarian', 'librarian', 'lib123', 'Library Administration')
    `);

    console.log('Seeding books...');
    await pool.query('TRUNCATE books RESTART IDENTITY CASCADE');
    await pool.query(`
      INSERT INTO books (title, author, category, available, img_url, description) VALUES
      ('Islamic Architecture', 'Dr. S.A. Hasan', 'History', true, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNtisE4sFIqF0GtbDKT_3KmrU_2b964sO-WAEVZ5tNCU_z5rwa3qkZkVpTrJCQjfJjbMVqWpaFHC0hhtaTNz04PYVX_2ALeGsjlzDs-XAydInL5QDNTBP6mawKQGfAJmuEVg9wiTs98AuwGvUqLFcNqVXHzeecHEumGzhyix0BQgh8ERIEZvpbxJEzNxgpUebF5cxr3fZ5wt-_GG3Xa_S2KNXRV5AFvnr_Sr1DiHRoamWzsEvfqmAUlDOWCgkTxziwKE9Kc8WNED8', 'A comprehensive guide to Islamic architectural styles across centuries.'),
      ('Echoes of Ghalib', 'Prof. M. Rizvi', 'Literature', true, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1XPdCrjb740fGW8LM4MYdFCuunNIHm9RGGYE49sLT8u7zdeGPO-V3FI7KxJda5aEBeR79zLOsys94bzN64TCIzD5L4LDQusWN6xnQe93E41OQK0KlGjXQdLUgkGldl-3HrUreQePo5Xo6Xq7-k9_Z7PZwqtQvC3swURcYMy5oDCbIHo_Biyjo3lUCcCi9kSBRakbotqAxq3WPz_3aawh52XUMlxedTCmNnruectTNBcrtXMLXcE8sL4RQ4_bLkPzzDb3AM0jfZnE', 'Analytical study of Mirza Ghalib poetry and its cultural impact.'),
      ('Institute Gazette Archives', 'Sir Syed Academy', 'Archives', false, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsRBHy8uAvvM6TUEIvHJVPwiZc87dB0AaJuwRg4BKnR6cHmOEsShQMWF537paM710B84lvcl6vGOEd4Q5wT8VHCSfs0JqmHHMOCOhaKwrBsh_lYk0NZ58BsxZ4Ea_2zmlcmMZdpo46xt0Te2UnnB4Ge3gpRd_gOerM_7M1mej0gF8tSxh-SkUF8X9U3JvX_BI_lnjYQVtLayBFnJDwNiI9LDplPWuIWh2IOdPlkTZagcDyaHPS3WqD8tfFvAMJuF-_2pLastqpxLI', 'Digitized archives of the historic Aligarh Institute Gazette.'),
      ('Origins of Algebra', 'Dept. of Mathematics', 'Science', true, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXC7fqu3v_AR1IIazJkj6sZpKEcXLsUT-U_XyWOzoCjHdlBvcoT5JbH9DKtvPnL1qUYiA79uFtHpzC4trs_itDb3K5Ey-XjEyN93OTUXELv63nUGGDynQ4mTxi5-mThHkgBVF5v1NA2DUZ7KmBq62YPickW76zG1sbIImMydW0GK4sDzSC_H2zmwmSEHM2hN6pqt2MDl1OEG5viBSVD2nweZny-oF7urXtE4JU4ugryIyowVB_u_fvt3QMqV37R0PXKYw1bSlL4zU', 'Exploring the roots of algebraic thinking in ancient and medieval eras.'),
      ('The Discovery of India', 'Jawaharlal Nehru', 'History', true, 'https://lh3.googleusercontent.com/aida-public/AB6AXuCx2yePR64Y0NBDNsCivTpZBvu_SgRivHHjh0a9eiGQ3F-7m4PW473-LVnr9JLYtXTm2XGgFldKzD7TOwh4IIFGV9_RBLokbMG73ruUw_rtb-u47Q0VfOtT_ieD-RILoRdw3anlwsVAIp3LVxZP3H__Mr1lOntoRNG0VgaGtEG_3xEnZRLfJh2A4vmIYa3IOxRZqRQ3grfgNyOO5J_d36qeAFH57kjZ-jBld1yuTORfNQQIQn8jS5tgXg8l36IVKsFn1YDN_rUhkd8', 'A masterpiece detailing Indias history from ancient times to the modern era.'),
      ('Mughal Architecture', 'Ebba Koch', 'History', false, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVi8gEpE9beDfGbplhGH9D4C6BCoTh9E22Xzpak17KrKamORq789lkDDWB1b6CyqCso62xGE9L06w3z7vEmPaKUW6smnzPHvAfkjYG1hEL7jRmbVRe9sdGrKVZBtF0Ut4Vf4FfhHgZJBXVFNHAKL11CAsfxkTISv9oizUZ6a5pjDObUTEsku7GL6BO2g0rRK3HUgxFS_09-G0a7o8melTS79mUyVBNKiRWYe4lMmAU-IhsXZxf_jLSnN4usznta1sMAjDOT7iZxmM', 'Detailed research on the architectural marvels of the Mughal Empire.')
    `);

    console.log('Seeding loans and saved items...');
    await pool.query('TRUNCATE loans, saved_items, requests, library_activities RESTART IDENTITY CASCADE');
    await pool.query(`
      INSERT INTO loans (user_id, book_id, due_date) VALUES
      (1, 5, CURRENT_DATE + INTERVAL '2 days'),
      (1, 6, CURRENT_DATE + INTERVAL '10 days'),
      (3, 1, CURRENT_DATE + INTERVAL '5 days'),
      (3, 4, CURRENT_DATE + INTERVAL '14 days');

      INSERT INTO saved_items (user_id, item_type, title) VALUES
      (1, 'Shodhganga Thesis', 'Socio-Economic Conditions during the Delhi Sultanate'),
      (1, 'Saved Manuscript', 'Baburnama (Persian Translation Fragment)'),
      (3, 'Digital Collection', 'Aligarh Movement Archival Letters'),
      (3, 'Research Paper', 'Impact of Scientific Society on Aligarh');

      INSERT INTO library_activities (icon, icon_bg, icon_color, message, meta) VALUES
      ('history_edu', 'bg-surface-container-low', 'text-on-surface-variant', 'Rare manuscript "Tarikh-i-Firoz Shahi" digitization completed.', 'Digital Archives Div.'),
      ('assignment_return', 'bg-surface-container-low', 'text-primary', 'Batch return processed for Faculty of Arts.', 'Circulation Desk'),
      ('warning', 'bg-error-container', 'text-on-error-container', 'Overdue notice escalated for ID: 994821.', 'System Auto');
    `);

    console.log('DB Initialization complete.');

  } catch (err) {
    console.error('Error initializing DB:', err);
  } finally {
    await pool.end();
  }
}

init();

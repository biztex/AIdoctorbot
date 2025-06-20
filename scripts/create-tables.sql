-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI診断結果テーブル
CREATE TABLE IF NOT EXISTS ai_diagnoses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  symptoms TEXT NOT NULL,
  diagnosis_result JSONB NOT NULL,
  urgency_level INTEGER NOT NULL,
  probability DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- チャット履歴テーブル
CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message TEXT NOT NULL,
  sender VARCHAR(10) NOT NULL, -- 'user' or 'ai'
  session_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初期管理者ユーザーの作成
INSERT INTO users (username, password_hash, email, role) 
VALUES ('admin', '$2b$10$rQZ8kHp0rJ0wVXjhKQxKxeGvQxQxQxQxQxQxQxQxQxQxQxQxQx', 'admin@example.com', 'admin')
ON CONFLICT (username) DO NOTHING;

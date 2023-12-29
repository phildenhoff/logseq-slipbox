import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

type UserID = string;
type Note = {
  id: number;
  content: string;
};

export const userIdFromLogin = (login: string): UserID => {
  return `user::${login}`;
};

export const allUserNotes = (userId: UserID, db: DB): Note[] => {
  const rows = db.query<[number, string]>(
    "SELECT id, content FROM notes WHERE user_id = :user_id;",
    { user_id: userId }
  );
  return rows.map((row) => {
    return {
      id: row[0],
      content: row[1],
    };
  });
};

export const allUserUnprocessedNotes = (userId: UserID, db: DB): Note[] => {
  const rows = db.query<[number, string]>(
    "UPDATE notes SET times_read = times_read + 1, times_processed = times_processed + 1 WHERE (user_id = :user_id) AND (times_processed < 1) RETURNING id, content;",
    { user_id: userId }
  );
  return rows.map((row) => {
    return {
      id: row[0],
      content: row[1],
    };
  });
};

export const addNote = (userId: UserID, content: string, db: DB) => {
  db.query(`INSERT INTO notes (content, user_id) VALUES (?, ?)`, [
    content,
    userId,
  ]);
};

import { DB } from "https://deno.land/x/sqlite@v3.8/mod.ts";

type UserID = string;

export const userIdFromLogin = (login: string): UserID => {
  return `user::${login}`;
};

const prepareQueryUserUnprocessedNotes = (db: DB) => {
  return db.prepareQuery<
    [string, number],
    { content: string; id: number },
    { user_id: string }
  >(
    "SELECT id, content FROM notes WHERE (user_id = :user_id) AND (times_processed < 1) ORDER BY id LIMIT 300 OFFSET 0;"
  );
};

const markNotesRead = (notes: { id: number }[], db: DB) => {
  const updateQuery = db.prepareQuery<
    [number],
    { times_processed: number },
    { id: number }
  >(
    "UPDATE notes SET times_read = times_read + 1, times_processed = 1 WHERE id = :id"
  );
  notes.forEach((row) => {
    updateQuery.allEntries({ id: row.id });
  });
  updateQuery.finalize();
};

export const allUserUnprocessedNotes = (userId: UserID, db: DB) => {
  const query = prepareQueryUserUnprocessedNotes(db);
  const rows = query.allEntries({ user_id: userId });
  query.finalize();
  markNotesRead(rows, db);
  return rows;
};

export const addNote = (userId: UserID, content: string, db: DB) => {
  db.query(`INSERT INTO notes (content, user_id) VALUES (?, ?)`, [
    content,
    userId,
  ]);
};

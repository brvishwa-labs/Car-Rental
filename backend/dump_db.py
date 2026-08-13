import sqlite3
import io

def dump_db():
    conn = sqlite3.connect('sql_app.db')
    with io.open('final.sql', 'w', encoding='utf-8') as f:
        for line in conn.iterdump():
            f.write('%s\n' % line)
    conn.close()

if __name__ == '__main__':
    dump_db()
    print("Database dumped to final.sql")

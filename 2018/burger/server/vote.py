import sqlite3
import tornado.web

conn = sqlite3.connect('server.db')
c = conn.cursor()

try:
    c.execute('''CREATE TABLE votes (burger CHARACTER(6), vote BOOLEAN)''')
except sqlite3.OperationalError as e:
    print("failed to create table", e)
    pass

class VoteHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
                                            
    def get(self):
        burger = self.get_argument('burger', '000000')
        vote = bool(self.get_argument('vote', 'true') == 'true')
        c.execute("INSERT INTO votes VALUES (?, ?)", (burger, vote))
        conn.commit()
        c.execute("SELECT output FROM labels WHERE burger = ?", (burger,))
        label = bool(c.fetchone()[0])
        
        self.write("Burger: %s Vote: %s Label: %s Correct: %s" % (burger, vote, label, vote==label))


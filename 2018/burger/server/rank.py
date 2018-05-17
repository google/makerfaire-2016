import pandas
import json
import tornado.web

class RankHandler(tornado.web.RequestHandler):
    def initialize(self, connection, burgers, model):
        self.connection = connection
        self.burgers = burgers
        self.model = model

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
                                            
    def get(self):
        result = self.model.rank()
        if result is None:
            self.set_status(404)
            response = {
                "error": "no ranks yet"
                }
        else:
            df, tp, fp, tn, fn = result
            results = list(zip(df.index, df.p_burger))

            response = {
                "results": results,
                "tp": tp,
                "fp": fp,
                "tn": tn,
                "fn": fn
                }
        self.write(json.dumps(response))
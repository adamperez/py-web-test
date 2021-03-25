from flask import Flask

from api.controllers.index import index_blueprint
from api.controllers.inventory_controller import inventory_blueprint
from api.controllers.reservation_controller import reservation_blueprint

app = Flask(__name__)

app.register_blueprint(index_blueprint)
app.register_blueprint(inventory_blueprint)
app.register_blueprint(reservation_blueprint)

app.run(host='0.0.0.0', port=5000)

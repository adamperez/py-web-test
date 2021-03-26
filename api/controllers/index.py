from flask import Blueprint, render_template


index_blueprint = Blueprint('index_blueprint', __name__, template_folder='templates')


@index_blueprint.route('/', methods=['GET'])
def index():
    """
    serve main index page
    :return:
    """
    return render_template('inventory.html')


@index_blueprint.route('/reservation', methods=['GET'])
def res_index():
    """
    serve main index page
    :return:
    """
    return render_template('reservation.html')

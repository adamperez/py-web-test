from flask import Blueprint, jsonify, request, flash

from api.managers.db_manager import session
from api.models import Reservation

reservation_blueprint = Blueprint('reservation_blueprint', __name__, url_prefix='/reservation')


@reservation_blueprint.route('/<res_id>', methods=['GET'])
def get_res_by_id(res_id):
    """
    look up reservation by id
    :param res_id:
    :return:
    """
    # look up ID, if non-exist return error message
    res = session.query(Reservation).filter_by(id=res_id).first()
    if not res:
        return jsonify({'error': 'no reservation with id {} found'.format(res_id)}), 400
    return jsonify({'reservation': res.serialize()})


@reservation_blueprint.route('/create', methods=['POST'])
def create_new_reservation():
    """
    create new reservation in db based on front end form, if inventory allows it
    :return:
    """
    if not request.json:
        return jsonify({'error': 'no body supplied'}), 400

    res = Reservation(**request.json)
    session.add(res)
    resp = session.commit()
    if not resp:
        # send message to flask for creation by name
        flash('reservation for {} created'.format(request.json.get('name')))
        return jsonify({'message': 'reservation for {} created'.format(request.json.get('name'))})

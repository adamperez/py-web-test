from flask import Blueprint, jsonify, request, flash

from api.managers.db_manager import session
from api.models import Reservation, Inventory
from api.util.date_util import time_str_to_obj

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
    todo error handling
    :return:
    """
    if not request.json:
        return jsonify({'error': 'no body supplied'}), 400

    # look up by date to see if any availability
    res_date = request.json.get('date', None)
    if not res_date:
        return jsonify({'error': 'no reservation date supplied'}), 400

    # check if res time present, if found, convert to DT object
    res_time = request.json.get('time', None)
    if not res_time:
        return jsonify({'error': 'no reservation time supplied'}), 400
    res_time = time_str_to_obj(res_time)

    open_inventory = session.query(Inventory).filter_by(date=res_date).all()
    if not open_inventory:
        return jsonify({'error': 'no open inventory for date {}'.format(res_date)})

    error = 'reservation invalid'
    for inv in open_inventory:
        for window in inv.windows:
            if window.current_res_count < window.max_res_count:
                # check if res date falls in current window
                window_start = time_str_to_obj(window.start_time)
                window_end = time_str_to_obj(window.end_time)

                # if requested res time is valid, update res count and save res
                if window_start <= res_time <= window_end:
                    window.current_res_count = window.current_res_count + 1
                    session.add(window)

                    res = Reservation(**request.json)
                    session.add(res)
                    resp = session.commit()
                    if not resp:
                        # send message to flask for creation by name
                        flash('reservation for {} created'.format(request.json.get('name')))
                        return jsonify({'message': 'reservation for {} created'.format(request.json.get('name'))})
                else:
                    error = 'requested reservation time is not available in current inventory'
            else:
                error = 'current inventory window cannot accept additional reservations, please select different time'

    return jsonify({'error': error}), 400

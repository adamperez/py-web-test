from flask import Blueprint, jsonify, request, flash

from api.managers.db_manager import session
from api.models import Inventory, InventoryWindow
from api.util.date_util import generate_inv_window_times, time_str_to_obj

inventory_blueprint = Blueprint('inventory_blueprint', __name__,
                                url_prefix='/inventory',
                                template_folder='templates')


@inventory_blueprint.route('/<inv_id>', methods=['GET'])
def get_inv_by_id(inv_id):
    """
    get inventory from db by ID
    :param inv_id:
    :return:
    """
    # look up ID, if non-exist return error message
    inv = session.query(Inventory).filter_by(id=inv_id).first()
    if not inv:
        return jsonify({'error': 'no inventory with id {} found'.format(inv_id)}), 400
    return jsonify({'inventory': inv.serialize()})


@inventory_blueprint.route('/all', methods=['GET'])
def get_all_invs():
    """
    get all inventory
    :return:
    """
    inv = session.query(Inventory).all()
    if not inv:
        flash('no inventory found', 'error')
        return jsonify({'error': 'no inventory found'}), 400
    return jsonify({'inventory': [i.serialize() for i in inv]})


@inventory_blueprint.route('/create', methods=['POST'])
def create_new_inventory():
    """
    create new inventory item
    # todo: error handling
    :return:
    """
    if not request.json:
        return jsonify({'error': 'no body supplied'}), 400

    windows = request.json.pop('windows', None)
    if not windows:
        return jsonify({'error': 'no inventory windows supplied'}), 400

    # create new inventory, then create new windows

    inv = Inventory(**request.json)
    session.add(inv)
    resp = session.commit()

    for win in windows:
        # exit case when start time > end time
        if time_str_to_obj(win.get('end_time')) <= time_str_to_obj(win.get('start_time')):
            error = 'inventory window end time should be greater than start time'
            flash(error, 'error')
            return jsonify({'error': error})

        # generate all 15 minute blocks per each start/end inventory time
        all_window_times = generate_inv_window_times(win.get('start_time'), win.get('end_time'))

        for time_pair in all_window_times:
            window = InventoryWindow(**win)
            window.inventory_id = inv.id
            window.current_res_count = 0
            window.start_time = time_pair[0]
            window.end_time = time_pair[1]
            session.add(window)
            resp = session.commit()

    if not resp:
        flash('inventory created', 'success')
        return jsonify({'message': 'inventory created'})

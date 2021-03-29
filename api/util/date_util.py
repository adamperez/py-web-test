from datetime import datetime, timedelta


def time_str_to_obj(time_in):
    """
    Convert HH:MM string to python dt object for comparisons
    :param time_in:
    :return:
    """
    return datetime.strptime(time_in, '%H:%M')


def generate_times_for_interval(start_time, end_time):
    """
    Take two times, find all 15 minute intervals
    :return:
    """
    start = time_str_to_obj(start_time)
    end = time_str_to_obj(end_time)

    times = []
    while start <= end:
        times.append(str(start.strftime('%H:%M')))
        start = start + timedelta(minutes=15)
    return times


def generate_inv_window_times(start_time, end_time):
    """
    combine generate times into tuples for db save
    :return:
    """
    times = generate_times_for_interval(start_time, end_time)

    windows = []
    # for i, time in enumerate(times):
    for i in range(len(times) - 1):
        t = (times[i], times[i+1])
        windows.append(t)
    return windows

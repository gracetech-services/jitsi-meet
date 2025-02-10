import { closeBreakoutRoom, createBreakoutRoom, removeBreakoutRoom } from '../../../../../breakout-rooms/actions';
import {
    getBreakoutRooms
} from '../../../../../breakout-rooms/functions';

/**
 * Removes all non-main Breakout Rooms and adds new rooms if needed.
 * If a room has no participants, it will be removed immediately.
 * If a room has participants, it will be closed first and then retried after a delay.
 *
 * @param {boolean} firstTime - Indicates whether this is the first attempt to close rooms.
 * @param {number} nAdd - The number of new rooms to be added.
 * @returns {void}
 */
export function removeAllRoomAndAdd(firstTime: boolean, nAdd: number): void {
    let roomsToAdd = nAdd;

    // const dispatch = useDispatch();
    const rooms = getBreakoutRooms(APP.store);
    const roomArr = Object.entries(rooms).filter(room => !room[1].isMainRoom);
    const nRoom = roomArr.length;

    const rooms2Close = roomArr.filter(room => Object.keys(room[1].participants).length > 0);
    const n2Close = rooms2Close.length;

    if (n2Close === 0) {
        roomArr.forEach(room => APP.store.dispatch(removeBreakoutRoom(room[1].jid)));
        if (roomsToAdd > 0) {
            if (nRoom === 0) {
                while (roomsToAdd > 0) {
                    APP.store.dispatch(createBreakoutRoom());
                    --roomsToAdd;
                }
            } else {
                setTimeout(() => removeAllRoomAndAdd(false, roomsToAdd), 100);
            }
        }
    } else {
        if (firstTime) {
            rooms2Close.forEach(room => APP.store.dispatch(closeBreakoutRoom(room[1].id)));
        }
        setTimeout(() => removeAllRoomAndAdd(false, roomsToAdd), 100);
    }
}

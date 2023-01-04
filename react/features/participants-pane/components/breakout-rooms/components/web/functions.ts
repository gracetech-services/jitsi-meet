import {
    getBreakoutRooms,
} from '../../../../../breakout-rooms/functions';

import {createBreakoutRoom, closeBreakoutRoom, removeBreakoutRoom } from '../../../../../breakout-rooms/actions';

export function removeAllRoomAndAdd (firstTime: boolean, nAdd: number): void {
  //const dispatch = useDispatch();
  const rooms = getBreakoutRooms(APP.store);
  const roomArr = Object.entries(rooms).filter((room)=>!room[1].isMainRoom);
  const nRoom = roomArr.length;
  
  const rooms2Close = roomArr.filter((room)=>Object.keys(room[1].participants).length > 0);
  const n2Close = rooms2Close.length;
  if (n2Close === 0) {
    roomArr.forEach((room)=>APP.store.dispatch(removeBreakoutRoom(room[1].jid)));
    if (nAdd > 0) {
      if (nRoom === 0) {
        while (nAdd > 0) {
          APP.store.dispatch(createBreakoutRoom());
          --nAdd;
        }
      }
      else {
        setTimeout(()=>removeAllRoomAndAdd(false, nAdd), 100);
      }
    }
  }
  else {
    if (firstTime) {
      rooms2Close.forEach((room)=>APP.store.dispatch(closeBreakoutRoom(room[1].id)));
    }
    setTimeout(()=>removeAllRoomAndAdd(false, nAdd), 100);
  }
};

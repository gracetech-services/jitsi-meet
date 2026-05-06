import { getCurrentConference } from '../base/conference/functions';
import StateListenerRegistry from '../base/redux/StateListenerRegistry';
import { IRooms } from '../breakout-rooms/types';

const SUPPRESS_NOTIFICATION_MS = 5000;

// Map of resource-id (the part after '/' in a JID) → expiry timestamp.
export const recentlyLeftBreakout = new Map<string, number>();

function collectBreakoutJids(rooms: IRooms | undefined): Set<string> {
    const jids = new Set<string>();

    Object.values(rooms ?? {}).forEach((r: any) => {
        if (r?.isMainRoom) {
            return;
        }
        Object.keys(r?.participants ?? {}).forEach(jid => jids.add(jid));
    });

    return jids;
}

StateListenerRegistry.register(
    state => state['features/breakout-rooms'].rooms,
    (rooms, _store, prevRooms) => {
        const prevJids = collectBreakoutJids(prevRooms);
        const currJids = collectBreakoutJids(rooms);
        const expiresAt = Date.now() + SUPPRESS_NOTIFICATION_MS;

        prevJids.forEach(jid => {
            if (!currJids.has(jid)) {
                const _jid = jid.slice(jid.indexOf('/') + 1);

                recentlyLeftBreakout.set(_jid, expiresAt);
            }
        });
    }
);

StateListenerRegistry.register(
    state => getCurrentConference(state),
    conference => {
        if (!conference) {
            recentlyLeftBreakout.clear();
        }
    }
);

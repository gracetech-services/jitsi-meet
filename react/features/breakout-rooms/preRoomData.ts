export interface IParticipant {
    displayName?: string;
    isNotInMeeting?: boolean;
    isSelected?: boolean;
    jid?: string;
    role?: 'participant' | 'moderator';
    userId?: string;
    isGroupLeader?: number;
}

export interface IBreakoutRoom {
    id: string;
    isMainRoom?: boolean;
    jid: string;
    name: string;
    participants: { [key: string]: IParticipant; };
}

export type AllRoomsData = {
    [key: string]: IBreakoutRoom;
};

// Store all room data
let allRooms: AllRoomsData = {};

// Generate a unique ID
const generateUniqueId = (): string => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Generate jid based on id
const generateJid = (id: string): string => `${id}@breakout.meet.jitsi`;

// Get all room data
export const getAllRoomsData = (): AllRoomsData => allRooms;

// Set all room data
export const setAllRoomsData = (data: AllRoomsData): void => {

    allRooms = data;
};

// Get the main room
export const getPreMainRoom = (): IBreakoutRoom | null => {
    for (const room of Object.values(allRooms)) {
        if (room.isMainRoom) {
            return room; // Return the main room
        }
    }

    return null; // Return null if the main room is not found
};

// Update room data. If ID is not provided, generate one. If jid is not provided, generate based on ID
export const updateRoomData = (roomId: string | undefined, newRoomData: Partial<IBreakoutRoom>): void => {
    const id = roomId || generateUniqueId(); // Generate a unique ID if roomId is not provided
    const jid = newRoomData.jid || generateJid(id); // Generate jid based on ID if not provided

    const existingRoom = allRooms[id];

    if (existingRoom) {
        // Merge existing room data with new data if room exists
        allRooms[id] = {
            ...existingRoom,
            ...newRoomData,
            id,
            jid
        };
    } else {
        // Create a new room if it doesn't exist
        allRooms[id] = {
            ...newRoomData,
            id,
            jid
        } as IBreakoutRoom;
    }
};

// Update participant data in a room
export const updateRoomParticipants = (roomId: string, newParticipants: { [key: string]: IParticipant; }): void => {
    const existingRoom = allRooms[roomId];

    if (existingRoom) {
        // Merge existing participants with new ones
        allRooms[roomId].participants = {
            ...existingRoom.participants,
            ...newParticipants
        };
    } else {
        console.warn(`Room with ID ${roomId} does not exist.`);
    }
};

// Remove a participant from a room
export const removeParticipantFromRoom = (roomId: string, participantJid: string): void => {
    const existingRoom = allRooms[roomId];

    if (existingRoom) {
        // Remove from participants structure
        const participant = existingRoom.participants[participantJid];

        delete existingRoom.participants[participantJid];

        // Remove from users structure if userId exists
        if (participant?.userId && existingRoom.users) {
            delete existingRoom.users[participant.userId];
        }
    } else {
        console.warn(`Room with ID ${roomId} does not exist.`);
    }
};

// Add a participant to a room
export const addParticipantToRoom = (
        roomId: string,
        participant: Omit<IParticipant, 'jid'> & { id?: string; jid?: string; }
): void => {
    const existingRoom = allRooms[roomId];

    if (!existingRoom) {
        console.warn(`⚠️ Room with ID ${roomId} does not exist.`);
        return;
    }

    // Ensure participants object exists
    if (!existingRoom.participants) {
        existingRoom.participants = {};
    }

    // Use userId as the primary key for participants
    const participantKey = participant.userId || participant.jid || generateUniqueId();

    // Enhanced deduplication: check by userId
    for (const [ otherRoomId, otherRoom ] of Object.entries(allRooms)) {
        if (otherRoom.participants) {
            if (participant.userId) {
                for (const [ existingKey, existingParticipant ] of Object.entries(otherRoom.participants)) {
                    if (existingParticipant.userId === participant.userId) {
                        removeParticipantFromRoom(otherRoomId, existingKey);
                        break;
                    }
                }
            }
        }
    }

    // Add the participant to the room (participants structure) using userId as key
    existingRoom.participants[participantKey] = {
        displayName: participant.displayName,
        userId: participant.userId || participantKey,
        isGroupLeader: participant.isGroupLeader || 0
    };

    console.log(`✅ IParticipant ${participantKey} has been added to room ${roomId}`);
};


// Remove a room and move its participants back to the main room
export const removeRoom = (roomId: string): void => {
    const roomToRemove = allRooms[roomId];

    if (!roomToRemove) {
        console.warn(`Room with ID ${roomId} does not exist.`);

        return;
    }

    // Get the main room
    const mainRoom = getPreMainRoom();

    if (!mainRoom) {
        console.warn('No main room found. Cannot move participants back.');

        return;
    }

    // Get all participants from the room to be removed
    const participantsToMove = roomToRemove.participants;

    // Move each participant to the main room
    for (const [ participantJid, participant ] of Object.entries(participantsToMove)) {
        // Add the participant to the main room
        addParticipantToRoom(mainRoom.id, participant);

        // Remove the participant from the current room
        removeParticipantFromRoom(roomId, participantJid);
    }

    // Delete the room
    delete allRooms[roomId];
    console.log(`Room with ID ${roomId} has been removed and participants moved back to the main room.`);
};

// Get all participants from a room
export const getParticipants = (roomId: string): { [participantJidkey: string]: IParticipant; } | null => {
    const room = allRooms[roomId];

    if (room) {
        return room.participants; // Return participant object
    }
    console.warn(`Room with ID ${roomId} does not exist.`);

    return null; // Return null if room doesn't exist
};

// Get all users from a room
export const getUsers = (roomId: string): { [userId: string]: { isGroupLeader: boolean; name: string; userId: string; }; } | null => {
    const room = allRooms[roomId];

    if (room) {
        return room.users || {}; // Return users object
    }
    console.warn(`Room with ID ${roomId} does not exist.`);

    return null; // Return null if room doesn't exist
};

// Get all participants from all rooms (ignore roomId)
export const getAllParticipants = (): { [participantJid: string]: IParticipant; } => {
    const allParticipants: { [participantJid: string]: IParticipant; } = {};

    Object.values(allRooms).forEach(room => {
        if (room.participants) {
            Object.assign(allParticipants, room.participants);
        }
    });

    return allParticipants;
};

// Get participants who are not in the specified room
export const getParticipantsNotInRoom = (roomId: string): { [participantJid: string]: IParticipant; } => {
    const participantsNotInRoom: { [participantJid: string]: IParticipant; } = {};


    Object.values(allRooms).forEach(room => {
        if (room.id !== roomId && room.participants) {
            Object.assign(participantsNotInRoom, room.participants);
        }
    });

    return participantsNotInRoom;
};

// Check if a participant is in a room
export const isParticipantInRoom = (roomId: string, participantJid: string): boolean => {
    const room = allRooms[roomId];

    if (room?.participants) {
        // Check if the participant with the specified jid exists
        return room.participants.hasOwnProperty(participantJid);
    }
    console.warn(`Room with ID ${roomId} does not exist or has no participants.`);

    return false; // Return false if room doesn't exist or has no participants
};

export const isEmailInAnyRoom = (email: string): boolean => {
    for (const room of Object.values(allRooms)) {
        if (room?.participants) {
            for (const participant of Object.values(room.participants)) {
                if (participant.email === email) {
                    return true;
                }
            }
        }
    }

    return false;
};

// Get all participants in a room by room name
export const getParticipantsByName = (roomName: string): { [participantJid: string]: IParticipant; } | null => {
    for (const room of Object.values(allRooms)) {
        if (room.name === roomName) {
            // Return participants if room found
            return room.participants || null;
        }
    }

    console.warn(`Room with name ${roomName} does not exist.`);

    return null; // Return null if room is not found
};


// Auto assign participants evenly across available rooms
export const distributeParticipantsEvenly = (): void => {
    // Get all rooms excluding the main room
    const rooms = Object.values(allRooms).filter(room => !room.isMainRoom);

    if (rooms.length === 0) {
        console.warn('No available rooms to distribute participants.');

        return;
    }
    const participants = Object.values(getAllParticipants());

    if (participants.length === 0) {
        console.warn('No participants to distribute.');

        return;
    }
    let index = 0;

    participants.forEach(participant => {
        const targetRoom = rooms[index]; // Select room in round-robin fashion

        addParticipantToRoom(targetRoom.id, participant);
        index = (index + 1) % rooms.length; // Round-robin assignment
    });
    console.log('All participants have been evenly distributed among available rooms.');
};

// Move a participant from any room to a specific room
export const sendParticipantToRoom = (targetRoomId: string, participantJid: string): void => {
    // Ensure the target room exists
    const targetRoom = allRooms[targetRoomId];

    if (!targetRoom) {
        console.warn(`Room with ID ${targetRoomId} does not exist.`);

        return;
    }

    let foundParticipant: IParticipant | null = null;

    // Traverse all rooms to find and remove the participant
    for (const [ roomId, room ] of Object.entries(allRooms)) {
        if (room.participants?.[participantJid]) {
            foundParticipant = room.participants[participantJid];
            removeParticipantFromRoom(roomId, participantJid);
            break;
        }
    }

    if (!foundParticipant) {
        console.warn(`Participant with JID ${participantJid} not found in any room.`);

        return;
    }

    // Add the participant to the target room
    addParticipantToRoom(targetRoomId, foundParticipant);
    console.log(`✅ Participant ${participantJid} moved to room ${targetRoomId}`);
};

// move its participants back to the main room
export const removeRoomAllParticipants = (roomId: string): void => {
    const roomToRemove = allRooms[roomId];

    if (!roomToRemove) {
        console.warn(`Room with ID ${roomId} does not exist.`);

        return;
    }

    // Get the main room
    const mainRoom = getPreMainRoom();

    if (!mainRoom) {
        console.warn('No main room found. Cannot move participants back.');

        return;
    }

    // Get all participants from the room to be removed
    const participantsToMove = roomToRemove.participants;

    // Move each participant to the main room
    for (const participant of Object.values(participantsToMove)) {
        addParticipantToRoom(mainRoom.id, participant);
    }


    console.log(`Room with ID ${roomId} has been moved its participants back to the main room.`);
};
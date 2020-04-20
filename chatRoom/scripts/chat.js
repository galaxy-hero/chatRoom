//add new chat documents
//setting up a real-time listener for new chats
//updating username
//updating room

class Chatroom{
    constructor(room, username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }
    //adding new chat documents
    async addChat(message){
        //format a chat object
        const now = new Date();
        const chat = { //chat object
            message: message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        };
        //save the chat document
        const response = await this.chats.add(chat);
        return response;
    }
    //set up real time listener for new chats
    getChats(callback){
        this.unsub = this.chats
            .where('room', '==', this.room)
            //order messages by created_at
            .orderBy('created_at')
            .onSnapshot(snapshot => {
                snapshot.docChanges()
                    .forEach(change => {
                        if(change.type === 'added') {
                            //update the ui
                            callback(change.doc.data())
                        }
                    });
            });
    }
    //update username
    updateName(username){
        this.username = username;
        localStorage.setItem('username', username);
    }

    //update chatroom
    updateRoom(room){
        this.room = room;
        console.log('room updated');
        if(this.unsub){
            //will unsubscribe from changes to the callback fc and will no longer be listening
            this.unsub();
        }
    }
}



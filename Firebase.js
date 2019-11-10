import firebase from 'firebase';

class Firebase {
	constructor() {
		this.init();
		this.observeAuth();
	}

	init = () => {
		firebase.initializeApp({
			apiKey: 'AIzaSyDzgnP3-c_Gshu_dTf5T2PL4otiLjWd4J4',
			authDomain: 'reactfirebaseapp-42cb6.firebaseapp.com',
			databaseURL: 'https://reactfirebaseapp-42cb6.firebaseio.com',
			projectId: 'reactfirebaseapp-42cb6',
			storageBucket: 'reactfirebaseapp-42cb6.appspot.com',
			messagingSenderId: '1030136452106',
			appId: '1:1030136452106:web:8a8f6518cb4c4413d23bf3',
			measurementId: 'G-N9CS7RDL9X'
		});
	};

	observeAuth = () => {
		firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
	};

	onAuthStateChanged = (user) => {
		if (!user) {
			try {
				firebase.auth().signInAnonymously();
			} catch ({ message }) {}
		}
	};

	get uid() {
		return (firebase.auth().currentUser || {}).uid;
	}

	get ref() {
		return firebase.database().ref('message');
	}

	parse = (snapshot) => {
		const { timestamp: numberStamp, text, user } = snapshot.val();
		const { key: _id } = snapshot;
		const timestamp = new Date(numberStamp);

		const message = {
			_id,
			timestamp,
			text,
			user
		};
		return message;
	};

	on = (callback) => {
		this.ref.limitToLast(50).on('child_added', (snapshot) => callback(this.parse(snapshot)));
	};

	get timestamp() {
		return firebase.database.ServerValue.TIMESTAMP;
	}

	send = (messages) => {
		for (let i = 0; i < messages.length; i++) {
			const { text, user } = messages[i];
			const message = {
				text,
				user,
				timestamp: this.timestamp
			};
			this.append(message);
		}
	};

	append = (message) => this.ref.push(message);

	off() {
		this.ref.off();
	}
}

Firebase.shared = new Firebase();
export default Firebase;

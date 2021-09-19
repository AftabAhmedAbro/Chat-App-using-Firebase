// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCm67ptVzXyLUsFxE5oV36TaDlGCNMN9K8",
    authDomain: "chat-app-pk-2021.firebaseapp.com",
    databaseURL: "https://console.firebase.google.com/u/1/project/chat-app-pk-2021/firestore/data/~2Fdb1",
    projectId: "chat-app-pk-2021",
    storageBucket: "chat-app-pk-2021.appspot.co",
    messagingSenderId: "282733091402",
    appId: "1:282733091402:web:650b58e05ad6899b6de4b3"
  };

firebase.initializeApp(firebaseConfig)

var db = firebase.firestore()

if (!localStorage.getItem('name')) {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
} else {
	name = localStorage.getItem('name')
}
document.querySelector('#name').innerText = name


document.querySelector('#change-name').addEventListener('click', () => {
	name = prompt('What is your name?')
	localStorage.setItem('name', name)
	document.querySelector('#name').innerText = name
})

document.querySelector('#message-form').addEventListener('submit', e => {
	e.preventDefault()

	let message = document.querySelector('#message-input').value
	db.collection('messages')
	.add({
		name: name,
		message: message,
		date: firebase.firestore.Timestamp.fromMillis(Date.now())
		})
	.then(docRef => {
		console.log(`Document written with ID: ${docRef.id}`)
		document.querySelector('#message-form').reset()
	})
	.catch(error => {
		console.log(`Error adding document: ${error}`)
	})
})

db.collection('messages')
.orderBy('date', 'asc')
.onSnapshot(snapshot => {
	document.querySelector('#messages').innerHTML = ''
	snapshot.forEach(doc => {
		let message = document.createElement('div')
		message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		`
		document.querySelector('#messages').prepend(message)
	})
})

document.querySelector('#clear').addEventListener('click', () => {
	db.collection('messages')
	.get()
	.then(snapshot => {
		snapshot.forEach(doc => {
			db.collection('messages').doc(doc.id).delete()
			.then(() => {
				console.log('Document successfully deleted!')
			})
			.catch((error) => {
				console.log(`Error removing document: ${error}`)
			})
		})
	})
	.catch(error => {
		console.log(`Error getting documents: ${error}`)
	})
})

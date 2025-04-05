class User {
	constructor(id, name, email, password) {
		this.id = id
		this.email = email
		this.password = password
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			email: this.email,
			password: this.password,
		}
	}
}

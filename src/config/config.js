// const config = {
// 	app: {
// 		port: 5005, // พอร์ตของเซิร์ฟเวอร์
// 	},
// 	db: {
// 		host: "postgres://neondb_owner:npg_hIn4tfJ5YEMz@ep-lively-heart-a1gidlp4-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
// 		port: 3306, // พอร์ตของ MySQL
// 		user: "neondb_owner", 
// 		password: "npg_hIn4tfJ5YEMz",
// 		database: "neondb",
// 	},
// }

// console.log("env working",config);

// export default config


const config = {
	app: {
		port: 5005, // พอร์ตของเซิร์ฟเวอร์
	},
	db: {
		host: "127.0.0.1",
		port: 3306, // พอร์ตของ MySQL
		user: "root",
		password: "",
		database: "carParking",
	},
}

export default config

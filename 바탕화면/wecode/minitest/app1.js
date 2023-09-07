const http = require('http')
const express = require('express')
const app = express()
const dotenv = require("dotenv")
dotenv.config()

const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
})


myDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  });

app.use(express.json())

app.get('/signin', async (req, res) => {
  try {
    const homeData = await myHomeDataSource.query(`SELECT id, name, email FROM users`)
    console.log("HOME DATA :", homeData)
    return res.status(200).json({
      "signin": homeData
    })
  } catch (error) {
    console.log(error)
  }
})

app.post('/signin', async (req, res) => {

  try {
    const work = req.body
    console.log("WORK", work)
    const { name, password, email } = work
    if (email === undefined || name === undefined || password === undefined) {
      const error = new Error("오류입니다!")
      error.statusCode = 400
      throw error
    }

    if (password.length < 8) {
      const error = new Error("PASSWORD를 다시 설정해주세요!")
      error.statusCode = 400
      throw error
    }

    const Myuser = await myDataSource.query(`
SELECT id, email FROM users WHERE email='${email}';
`)
    console.log('My user: ', Myuser)

    if (Myuser.length !== 0) {
      const error = new Error("이메일 중복입니다!")
      error.statusCode = 400
      throw error
    }





    const homeData = await myDataSource.query(`
INSERT INTO users(
  name,
  password,
  email
)
VALUES (
 
  "${name}",
  "${password}", 
  "${email}"
)
`)



    console.log('iserted user id', homeData.insertId)

   

    return res.status(201).json({
      "message": "축하합니다 회원이 되셨습니다!"
    })



  } catch (error) {
    console.log(error)
  }


})


app.post('/signup', async (req, res) => {
  try {

    const userEmail = req.body.email
    console.log("email: ", userEmail)
    const userPassword = req.body.password
    console.log("password: ", userPassword)
    const { email, password } = req.body 
   
    if (email === undefined || password === undefined) {
      const error = new Error("오류입니다!")
      error.statusCode = 400
      throw error
    }


    const loginUserEmail = await myDataSource.query(`
    SELECT id, email FROM users WHERE email='${email}';
    `)
    if (loginUserEmail.length === 0) {
      const error = new Error("이메일이 아닙니다")
      error.statusCode = 400
      throw error
    }

    const loginUserPassword = await myDataSource.query(`
    SELECT id, email FROM users WHERE password='${password}';
    `)
    if (loginUserPassword == false) {
      const error = new Error("PASSWORD를 다시 입력해주세요!")
      error.statusCode = 400
      throw error
    }
    return res.status(201).json({
      "message": "환영합니다!"
    })

    



  } catch (error) {
    console.log(error)
  }
})



const server = http.createServer(app) 

const start = async () => { 
  try {
    server.listen(8000, () => console.log(`Server is listening on 8000`))
  } catch (err) {
    console.error(err)
  }
}






















start()

const express = require('express')
const mysql = require('mysql')
const app = express()
const port = process.env.PORT || 3000;
const nodemailer = require('nodemailer')

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}));

app.get('/', (req, res) => res.render('pages/home'))
app.get('/services', (req, res) => res.render('pages/services'))

app.get('/contact', (req, res) => res.render('pages/contact'))
app.get('/videos', (req, res) => res.render('pages/videos'))
app.get('/contactform', (req, res) => res.render('pages/contactform'))

//conexion
const connection = mysql.createConnection({
    host: 'freedb.tech', 
    user: 'freedbtech_DianaAndujar',
    password: 'dianita2223444',
    database: 'freedbtech_trabajoFinalDianaDB'
}) 

//check connect
connection.connect(error => {
    if (error) throw error;
    console.log('Database running');
})

app.get('/clients', (req, res) => {
     const sql = 'SELECT * FROM Clientes';

     connection.query(sql, (error, results) => {
         if (error) { 
             throw error;
         }
         res.render('pages/clients', {
             'results': results
         })
     })
});

 app.get('/ordernow', (req, res) => res.render('pages/orderNow'))

 app.post('/ordernow', (req, res) => {
     const sql = `SELECT * FROM Clientes WHERE email = '${req.body.email}'`; 
    const sql2 = 'INSERT INTO Clientes SET ?';
    
    const {names, last_names, email, phone_number, description} = req.body;

    contentHTML = `
         <h1>clients information</h1>
         <ul> 
         <li> name: ${names} </li>   
         <li> last name: ${last_names} </li> 
         <li> email: ${email} </li> 
         <li> phone number: ${phone_number} </li> 
          </ul>
          <p> ${description} </p>
    `

    const transporter = nodemailer.createTransport({
      service: 'gmail' , 
      auth: {
          user: 'proyectofdiana@gmail.com',
          pass: 'Braulin123456'
      }  
    })
    const info = { 
        from: 'proyectofdiana@gmail.com', 
        to: 'dianaandujarg@gmail.com',
        subject: 'Contact Form',
        html: contentHTML
    }

     connection.query(sql, (error, results) => {
         if (error) { 
             throw error;
         }
         if (!results.length > 0) {
             const clientesObj = {
                 names: req.body.names,
                 last_names: req.body.last_names,
                 email: req.body.email,
                 phone_number: req.body.phone_number
             }
     
             connection.query(sql2, clientesObj, error => {
                 if (error) {
                     throw error;
                 }
             
             })
         } 
          //enviar correo
          transporter.sendMail(info, error => {
             if (error) {
              throw error;
             } else {
                 console.log('email enviado')
             }
         })
       
     })
     res.render('pages/home')
  
 })


app.listen(port, () => console.log('server running'))

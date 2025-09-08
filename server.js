require("dotenv").config();
const express = require("express");
const cors = require("cors");


const database = require("./config/db_mysql");
const authRoutes = require("./auth/authRoute");

const app = express();

app.use(cors());
app.use(express.json());


database.sequelize.authenticate()
.then(()=> console.log("Database Connected"))
.catch((err)=>console.log("error",err));


// database.sequelize.sync({alter:true})
//   .then(()=>{
//     console.log("sync successfull");    
//   })
//   .catch((err)=>{
//     console.log("failed");
    
// });



app.use("/auth", authRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);

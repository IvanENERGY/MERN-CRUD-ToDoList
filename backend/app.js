const express=require('express');
const router=require('./routes/index');
const mongoose=require('mongoose');
const cors=require('cors')
const app=express();
app.set("port",process.env.PORT||3000);
mongoose.connect("mongodb+srv://ivanchantf:Yy6566683%40%402@cluster0.ud4o2vd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
// mongoose.connect("mongodb://localhost:27017/todo_db");
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());



app.use("/",router);
app.listen(app.get("port"),()=>{console.log(`The app is listening on PORT ${app.get("port")}`)});




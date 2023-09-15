const express = require('express');
const {mobile, user} = require('./model/index');
const bcrypt = require('bcryptjs');
const app = express();

app.set('view engine','ejs');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static('public/'))



app.get('/register',(req,res)=>{
    res.render('register.ejs')
})

app.get('/',async (req,res)=>{
    const data =await mobile.findAll({
        order:[['updatedAt','DESC']]
    })
    console.log(req.body)
    res.render('home.ejs',{data})
})

app.get('/singleBlog/:id', async (req, res) => {
    const id = req.params.id;
    const data = await mobile.findAll({
        where: {
            id: id
        }
    });

    res.render('singleBlog.ejs', { data });
});


app.get('/createForm',(req,res)=>{
    res.render('createForm.ejs')
})

app.get('/updateForm/:id', async (req,res)=>{
    const id = req.params.id
    const data = await mobile.findAll({
        where :{
            id:id
        }
    })
    res.render('updateForm.ejs',{data})

})

app.get('/login',(req,res)=>{
    res.render('login.ejs')
})


app.get('/logout',(req,res)=>{
    res.redirect('/login')
})

// POST API
app.post('/createForm',async (req,res)=>{
    const mobiles = req.body.name;
    const price = req.body.price;
    const description = req.body.description;

    await mobile.create({
        name:mobiles,
        price:price,
        description:description
    })
    res.redirect('/');
})

app.post('/updateForm/:id', async (req,res)=>{
    const id = req.params.id;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;

    const data = await mobile.update({
        name:name,
        price:price,
        description:description
    },{
        where:{
            id:id
        }
    })
    res.redirect('/singleBlog/'+id);
})

app.post('/register', async (req,res)=>{
    const usernames = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if(usernames != "" && email !="" && password != ""){
        const checkUserNameInDb = await user.findAll({ 
            where:{ 
                username:usernames
            }
        }) 
        const checkEmailInDb = await user.findAll({
            where:{
                email:email
            }
        })

        if( checkEmailInDb.length == 0 && checkUserNameInDb == 0){
            const haspassword = bcrypt.hashSync(password,12);
            await user.create({
                username: usernames,
                email:email,
                password:haspassword
            })
            res.redirect('/login')

        }else{
            res.send("Email or Username Already exist")
        }

    }else{
        res.send("All fields are required");
    }
   
})

// login garn ko lagi
app.post('/login', async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    // database baat data fetch gareko
    const checkUserEmailInDb = await user.findAll({
        where:{
            email:email,
        }
    })
    // validation
    if(email != "" && password !=""){
        if(checkUserEmailInDb.length == 0){
            res.send("Sorry We couldn't find an account with that user name");
        }else if(checkUserEmailInDb.length == 1){
            //database baat aako hash password lai DbPassword variable ma store gareko
            const DbPassword = checkUserEmailInDb[0].password;  
            // hash password ra user-input password lai compare gareko 
            bcrypt.compare(password, DbPassword,(err,result)=>{
                if(err){
                    console.log("Error comparing password" , err);
                }else if(result){
                    console.log("Sucessfully Login");
                    res.redirect('/'); 
                }else{
                    res.send("Invalid Email or  Password");
                }
            })
        }else{
            res.send("Something went wrong")
        }
    }else{
        res.send("All fields are required");
    }
})



// DELETE API
app.get('/delete/:id',async (req,res)=>{
    const id = req.params.id;
    await mobile.destroy({
        where :{
            id :id
        }
    })
    res.redirect('/');
})



app.listen(3000, ()=>{
    console.log("Node Js has started at port number 3000");
})